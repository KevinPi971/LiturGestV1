if(!sessionStorage.userCo)window.location.replace("/login.html");
const objEltDOM = {};
let user = {};
let fonctions = {};
let statContact = 1;
const listOkModif = ["Enregistrer", "Modifier"];
let listContact = [];
let listFonctions = [];
let listTessiture = [];
let listInstrument = [];
let listUserFonction = [];
let listUserTessiture = [];
let listUserInstrument = [];
initPage();
function initPage(){
    //  Récupération du user
    user = JSON.parse(sessionStorage.userCo);
    
    //  Initialisation de l'encadré contact
    initContact();
    
    //  Initilisation de l'encadré fonction
    initFonction();
}

//  Fonction encadré Contact
async function initContact(){
    //  Récupération des list pour l'initialisation de la page
    const listProfilsDOM = addToListRadical(await getListId("profil"), "profil");
    const listColsUserDOM = getListColsUser();
    const listPropDOM = listColsUserDOM
        .concat(listProfilsDOM);
    listContact = listColsUserDOM
        .concat(listProfilsDOM)
        .concat(["mdp2"]);
    
    //  Initialisation de l'objet contenant les éléments du DOM
    for(let lp of listPropDOM){
        addPropertyOfDOM(lp);
        setValueUserOnDOM(lp, user[lp]);
    }
    addPropertyOfDOM("mdp2");
    setValueUserOnDOM("mdp2", user.mdp);
    
    //  Droit de visu profil admin
    if(user.profil > 1){
        document.getElementById("labelProfil1").style.display = "none";
        objEltDOM.profil1.style.display = "none";
    }
    
    //Gestion des formats
    objEltDOM.nom.addEventListener("keyup", formatNom());
    objEltDOM.prenom.addEventListener("keyup", formatPrenom());
    objEltDOM.tel.addEventListener("keyup", formatTel());
    
    
    addPropertyOfDOM("okContact");
    addPropertyOfDOM("formContact");
    objEltDOM.formContact.addEventListener("submit", okOrModifActionContact(listContact));
}
function getListColsUser(){
    const ret = [];
    for(let c of Object.keys(user)){
        if(c != "id" && c != "profil"){
            ret.push(c);
        }
    }
    return ret;
}
function setValueUserOnDOM(nProp, value){
    if(nProp.indexOf("profil") != -1 && nProp.indexOf(user.profil) != -1){
        objEltDOM[nProp].checked = true;
        return
    }
    if(!objEltDOM[nProp]){
        console.log("La proprieté " + nProp + " n'existe pas");
        return;
    }
    if(objEltDOM[nProp].type == "checkbox"){
        objEltDOM[nProp].checked = value == "true";
    }else if(objEltDOM[nProp].type == "text" || objEltDOM[nProp].type == "date" || objEltDOM[nProp].type == "tel" || objEltDOM[nProp].type == "email" || objEltDOM[nProp].type == "password"){
        objEltDOM[nProp].value = value;
    }
}
function hasChangeContact(nProp, objTable){
    if(objEltDOM[nProp].type == "radio"){
        const propTable = deleteCaracteres(nProp, /[A-z]/);
        if(objTable[propTable]){
            return objEltDOM[nProp].checked != (nProp.indexOf(objTable[propTable]) != -1);
        }
    }else if(objEltDOM[nProp].type == "checkbox"){
        if(objTable[nProp] != undefined){
            return !(objEltDOM[nProp].checked == objTable[nProp] || (("" + objEltDOM[nProp].checked) == objTable[nProp]));
        }else{
            //  A finaliser
            const propTable = deleteCaracteres(nProp, /[A-z]/);
            const idOnTableDef = deleteCaracteres(nProp, /[0-9]/);
            console.log(objTable[propTable]);
        }
    }else{
        return objEltDOM[nProp].value != objTable[nProp];
    }
}
function hasChangeContactList(list,objTable){
    let isChange = false;
    for(let l of list){
        isChange = hasChangeContact(l, objTable) || isChange;
    }
    return isChange;
}
function verifyModifContact(){
    let msg = "";
    let isChange = hasChangeContactList(listContact.reduce(function(relai, elt){
        if(elt != "mdp2")relai.push(elt);
        return relai;
    }, []), user);
    for(let lc of listContact){
        if(lc == "mdp2")continue;
        isChange = hasChangeContact(lc, user) || isChange;
    }
    if(!isChange)return null;
    if(objEltDOM.mdp.value != objEltDOM.mdp2.value){
        msg += "Les mots de passes doivent être identiques.\n";
    }
    if(formatMdp()){
        msg += "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre, ne doit pas contenir de caractère spécial et doit avoir entre 8 et 16 caractère\n";
    }
    return msg;
}
async function saveModifContact(){
    const msg = verifyModifContact();
    const colsToUpdate = [];
    if(msg == null){
        return true;
    }
    if(msg.length > 0){
        alert(msg);
        return false;
    }
    for(let lc of listContact){
        if(lc == "mdp2")continue;
        if(hasChangeContact(lc, user)){
            if(lc.indexOf("profil") != -1){
                if(objEltDOM[lc].checked){
                    user.profil = lc.substring("profil".length)*1;
                    colsToUpdate.push("profil");
                }else{
                    continue;
                }
            }else if(objEltDOM[lc].type == "checkbox"){
                user[lc] = "" + objEltDOM[lc].checked;
                colsToUpdate.push(lc);
            }else{
                user[lc] = objEltDOM[lc].value;
                colsToUpdate.push(lc);
            }
            await saveUserDB(colsToUpdate, user);
            sessionStorage.userCo = JSON.stringify(await getUserById(user.id).then(u => {
                return u.length == 1 ? u[0] : null;
            }));
        }
    }
    return true;
}
function okOrModifActionContact(){
    return async function(e){
        e.preventDefault();
        if(statContact == 1){
            setDisabledStatList(listContact, false);
            statContact = 1 - statContact;
            objEltDOM.okContact.value = listOkModif[statContact];
        }else{
            setDisabledStatList(listContact, true);
            const isSave = await saveModifContact();
            if(isSave){
                statContact = 1 - statContact;
                objEltDOM.okContact.value = listOkModif[statContact];
            }else{
                setDisabledStatList(listContact, false);
            }
        }
    }
}

//  Fonctions encadré Fonction
async function initFonction(){
    listTessiture = await getListDB("tessiture");
    listInstrument = await getListDB("instrument");
    addPropertyOfDOM("formFonction");
    objEltDOM.formFonction.addEventListener("submit", okActionFonction());
    await addFonctionsOnDOM();
    addPropertyOfDOM("okFonction");
    await addFonctionsLvl2OnDOM();
    setValuesFonctionsOnDOM();
    objEltDOM.formFonction.addEventListener("change", function(e){
        let isChange = hasChangeFonctions("fonction", listFonctions, listUserFonction) ||
                hasChangeFonctions("tessiture", listTessiture, listUserTessiture) ||
                hasChangeFonctions("instrument", listInstrument, listUserInstrument) ;
        setDisabledStat("okFonction", !isChange); ;
    })
}
function addFonctionOnDOM(fonc){
    let contenu = "<div class=\"forms-profils\" style=\"border-top: 1px solid gray\">" +
            "<label for=\"fonction" + fonc.id + "\" class=\"forms-profils\">" + fonc.title + "</label>" +
            "<input id=\"fonction" + fonc.id + "\" class=\"forms-profils\" type=\"checkbox\">" +
            "<div class=\"forms-profils\" id=\"fonctionLvl2" + fonc.id + "\" style=\"display:table-cell\">" + 
            "</div>" +
            "</div>";
    
    return contenu;
}
async function addFonctionsOnDOM(){
    let contenu = "";
    listFonctions = await getListDB("fonction");
    for(let lf of listFonctions){
        contenu += addFonctionOnDOM(lf);
    }
    contenu += "<div class=\"forms-profils\">" + 
            "<input type=\"submit\" id=\"okFonction\" value=\"Enregistrer\" disabled=\"true\">" + 
            "</div>";
    objEltDOM.formFonction.innerHTML = contenu;
    for(let lf of listFonctions){
        addPropertyOfDOM("fonction" + lf.id);
    }
}
async function addFonctionLvl2OnDOM(table, idFonction){
    addPropertyOfDOM("fonctionLvl2" + idFonction);
    objEltDOM["fonction" + idFonction].addEventListener("click", changeDisplay(objEltDOM["fonctionLvl2" + idFonction], "table-cell"));
    
    const listFonctionsLvl2 = await getListDB(table);
    let contenu = "";
    for(let lfl2 of listFonctionsLvl2){
        contenu += "<div class=\"forms-profils\">" +
                "<label for=\"" + table + lfl2.id + "\" class=\"forms-profils\">" + lfl2.title + "</label>" +
                "<input id=\"" + table + lfl2.id + "\" class=\"forms-profils\" type=\"checkbox\">" +
                "</div>";
        
    }
    objEltDOM["fonctionLvl2" + idFonction].innerHTML = contenu;
    for(let lfl2 of listFonctionsLvl2){
        addPropertyOfDOM(table + lfl2.id);
    }
    
}
function addFonctionsLvl2OnDOM(){
    addFonctionLvl2OnDOM("tessiture" , 2);
    addFonctionLvl2OnDOM("instrument" , 3);
}
function setValuesFonctionOnDOM(nProp, listOccurence){
    for(let i = 0; i < listOccurence.length; i++){
        objEltDOM[nProp + listOccurence[i][nProp]].checked = true;
    }
}
async function setValuesFonctionsOnDOM(){
    listUserFonction = await getDataForUserDB("user_fonction", user.id);
    listUserTessiture = await getDataForUserDB("user_tessiture", user.id);
    listUserInstrument = await getDataForUserDB("user_instrument", user.id);
    
    setValuesFonctionOnDOM("fonction", listUserFonction);
    setValuesFonctionOnDOM("tessiture", listUserTessiture);
    setValuesFonctionOnDOM("instrument", listUserInstrument);
    
    objEltDOM.fonctionLvl22.style.display = objEltDOM.fonction2.checked ? "table-cell" : "none";
    objEltDOM.fonctionLvl23.style.display = objEltDOM.fonction3.checked ? "table-cell" : "none";
}
function hasChangeFonctions(nProp, listAll, listUser){
    for(let la of listAll){
        if(existOcurrenceForTableLink(nProp + la.id, listUser) && !objEltDOM[nProp + la.id].checked)return true;
        if(!existOcurrenceForTableLink(nProp + la.id, listUser) && objEltDOM[nProp + la.id].checked)return true;
    }
    return false;
}
async function addOrDeleteOccurrencesForFonction(list){
    console.log(list);
    for(let l = 0; l < list.length; l++){
        const propTable = deleteCaracteres(l, /[A-z]/);
        const idOnTableDef = deleteCaracteres(l, /[0-9]/);
        if(existOcurrenceForFonction(l, obj.objTable) && !objEltDOM[l].checked){
            await deleteOptionForUserDB("user_" + propTable, user.id, propTable, idOnTableDef);
        }else if(!existOcurrenceForFonction(l, obj.objTable) && objEltDOM[l].checked){
            await addOptionForUserDB("user_" + propTable, user.id, propTable, idOnTableDef);
        }
    }
}
function okActionFonction(){
    return async function(e){
        e.preventDefault();
        
        
        if(!objEltDOM.fonction2.checked){
            setCheckedListFalse("tessiture", listTessiture)
        }
        if(!objEltDOM.fonction3.checked){
            setCheckedListFalse("instrument", listInstrument)
        }
        
        if(hasChangeFonctions("tessiture", listTessiture, listUserTessiture)){
            addOrDeleteOccurrencesForFonction(listUserTessiture);
            listUserTessiture = await getDataForUser("user_tessiture", user.id);
        }
        
        setDisabledStat("okFonction", true);
    }
}

//  Fonctions communes