if(!sessionStorage.userCo)window.location.replace("/login.html");
const objEltDOM = {};
let user = {};
let statContact = 1;
const listOkModif = ["Enregistrer", "Modifier"];
let listContact = [];
let listTessitureUser = [];
let listInstrumentUser = [];
initPage();
async function initPage(){
    //  Récupération du user
    user = JSON.parse(sessionStorage.userCo);
    
    //  Récupération des list pour l'initialisation de la page
    const listProfilsDOM = addToListRadical(await getListId("profil"), "profil");
    const listColsUserDOM = getListColsUser();
    //const listFonctionDOM = ["chantre", "choeur", "musicien"];
    //const listTessitureDOM = addToListRadical(await getListId("tessiture"), "tessiture");
    //const listInstrumentDOM = addToListRadical(await getListId("instrument"), "instrument");
    //const listFormCondDOM = ["tessiture","instrument"];
    const listPropDOM = listColsUserDOM
        //.concat(listTessitureDOM)
        //.concat(listInstrumentDOM)
        .concat(listProfilsDOM)
        //.concat(listFormCondDOM);
    listContact = listColsUserDOM
        .concat(listProfilsDOM);
    listContact.push("mdp2");
    /*for(let lf of listFonctionDOM){
        listContact.splice(listContact.indexOf(lf), 1);
    }*/
    
    
    //  Initialisation de l'objet contenant les éléments du DOM
    for(let lp of listPropDOM){
        addPropertyOfDOM(lp);
        setValueOnDOM(lp, user[lp]);
    }
    addPropertyOfDOM("mdp2");
    setValueOnDOM("mdp2", user.mdp);
    
    if(user.profil > 1){
        document.getElementById("labelProfil1").style.display = "none";
        objEltDOM.profil1.style.display = "none";
    }
    
    //Gestion des formats
    objEltDOM.nom.addEventListener("keyup", formatNom());
    objEltDOM.prenom.addEventListener("keyup", formatPrenom());
    objEltDOM.tel.addEventListener("keyup", formatTel());
    
    
    //  Gestion de l'affichage conditionnel des Fonctions
    /*setDisplay(objEltDOM.tessiture, user.choeur);
    objEltDOM.choeur.addEventListener("click", changeDisplay(objEltDOM.tessiture));
    listTessitureUser = await getDataForUser("user_tessiture", user.id);
    for(let ltu of listTessitureUser){
        setValueOnDOM("tessiture" + ltu.tessiture, "true");
    }
    
    setDisplay(objEltDOM.instrument, user.musicien);
    objEltDOM.musicien.addEventListener("click", changeDisplay(objEltDOM.instrument));
    listInstrumentUser = await getDataForUser("user_instrument", user.id);
    for(let liu of listInstrumentUser){
        setValueOnDOM("instrument" + liu.instrument, "true");
    }*/
    
    addPropertyOfDOM("okContact");
    addPropertyOfDOM("formContact");
    objEltDOM.formContact.addEventListener("submit", okOrModifActionContact(listContact));
    
    //addPropertyOfDOM("okFonction");
    //addPropertyOfDOM("formFonction");
    /*const objFonction = {
        "user" : {list:listFonctionDOM,objTable:user},
        "tessiture" : {list:listTessitureDOM,objTable:listTessitureUser},
        "instrument" : {list:listInstrumentDOM,objTable:listInstrumentUser}
    }*/
    //objEltDOM.formFonction.addEventListener("change", isChangeFonction(objFonction));
    //objEltDOM.formFonction.addEventListener("submit", okActionFonction(objFonction, listTessitureDOM, listInstrumentDOM));
}


function formatNom(){
    return function(e){
        const position = e.target.selectionStart;
        e.target.value = e.target.value.toUpperCase();
        e.target.selectionStart = position;
        e.target.selectionEnd = position;
        
        deleteWrongCaractere(e, /[A-ZÀ-Ÿ\-\']/);
        
    }
}
function formatPrenom(){
    return function(e){
        deleteWrongCaractere(e, /[A-Za-zÀ-ÿ\-\']/);
        const position = e.target.selectionEnd;
        const listPrenom = e.target.value.split(/[\-\']/);
        let pos = 0;
        for(let lp of listPrenom){
            e.target.value = (pos == 0 ? "" : e.target.value.substring(0, pos)) + upperFirstChar(lp) + e.target.value.substring(pos + lp.length);
            pos += lp.length + 1;
        }
        e.target.selectionStart = position;
        e.target.selectionEnd = position;
    }
}
function upperFirstChar(word){
    if(word && word.length > 0)
        return word[0].toUpperCase() + word.substring(1).toLowerCase();
    else
        return ""
}
function formatTel(){
    return function(e){
        const position = e.target.selectionEnd;
        const size = e.target.value.length;
        const posSpace = [2, 5, 8, 11];
        deleteWrongCaractere(e, /[0-9]/);
        for(let i = 0; i < posSpace.length; i++){
            if(e.target.value.length > posSpace[i])addSpace(posSpace[i]);
        }
        
        if(e.target.value.length > 14){
            e.target.value = e.target.value.substring(0, 14);
        }
        
        function addSpace(pos){
            if(" " == e.target.value[pos]){
                return;
            }
            e.target.value = e.target.value.substring(0, pos) + " " + e.target.value.substring(pos);
        }
    }
}
/*function setDisplay(form, value){
    form.style.display = value ? "block":"none";
}*/
/*function changeDisplay(form){
    return function(e){
        form.style.display = e.target.checked ? "block":"none";
    }
}*/
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
/*function okActionFonction(listObj, listTessitures, listIntruments){
    return async function(e){
        e.preventDefault();
        if(hasChangeList(listObj.user.list, listObj.user.objTable)){
            for(let l of listObj.user.list){
                if(hasChange(l, user)){
                    user[l] = "" + objEltDOM[l].checked;
                    await saveUserDB([l], user);
                    sessionStorage.userCo = JSON.stringify(await getUserById(user.id).then(u => {
                        return u.length == 1 ? u[0] : null;
                    }));
                }
            }
        }
        if(!objEltDOM.choeur.checked){
            setCheckedListFalse(listTessitures)
        }
        if(!objEltDOM.musicien.checked){
            setCheckedListFalse(listIntruments)
        }
        if(hasChangeFonction(listObj.tessiture)){
            addOrDeleteOccurrencesForFonction(listObj.tessiture);
            listTessitureUser = await getDataForUser("user_tessiture", user.id);
        }
        if(hasChangeFonction(listObj.instrument)){
            addOrDeleteOccurrencesForFonction(listObj.instrument);
            listInstrumentUser = await getDataForUser("user_instrument", user.id);
        }
        setDisabledStat("okFonction", true);
    }
}*/
function setCheckedListFalse(list){
    for(let l of list){
        objEltDOM[l].checked = false;
    }
}// **********************
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
        if(hasChange(lc, user)){
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
function verifyModifContact(){
    let msg = "";
    let isChange = hasChangeList(listContact.reduce(function(relai, elt){
        if(elt != "mdp2")relai.push(elt);
        return relai;
    }, []), user);
    for(let lc of listContact){
        if(lc == "mdp2")continue;
        isChange = hasChange(lc, user) || isChange;
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
/*function isChangeFonction(listObj){
    return function(e){
        let isChange = hasChangeList(listObj.user.list, listObj.user.objTable) ||
                hasChangeFonction(listObj.tessiture) ||
                hasChangeFonction(listObj.instrument);
        objEltDOM.okFonction.disabled = !isChange;
    }
}*/
function formatMdp(){
    return objEltDOM.mdp.value.match(/[A-Z]/) == null
        || objEltDOM.mdp.value.match(/[a-z]/) == null
        || objEltDOM.mdp.value.match(/[0-9]/) == null
        || objEltDOM.mdp.value.length < 8
        || objEltDOM.mdp.value.length > 16;
}
function hasChange(nProp, objTable){
    if(objEltDOM[nProp].type == "radio"){
        const propTable = deleteCaracteres(nProp, /[A-z]/);
        if(objTable[propTable]){
            return objEltDOM[nProp].checked != (nProp.indexOf(objTable[propTable]) != -1);
        }
    }else if(objEltDOM[nProp].type == "checkbox"){
        if(objTable[nProp] != undefined){
            return !(objEltDOM[nProp].checked == objTable[nProp] || (("" + objEltDOM[nProp].checked) == objTable[nProp]));
        }else{
            const propTable = deleteCaracteres(nProp, /[A-z]/);
            const idOnTableDef = deleteCaracteres(nProp, /[0-9]/);
            console.log(objTable[propTable]);
        }
    }else{
        return objEltDOM[nProp].value != objTable[nProp];
    }
}
function hasChangeList(list,objTable){
    let isChange = false;
    for(let l of list){
        isChange = hasChange(l, objTable) || isChange;
    }
    return isChange;
}
/*function hasChangeFonction(obj){
    let isChange = false;
    for(let l of obj.list){
        if(existOcurrenceForFonction(l, obj.objTable) && !objEltDOM[l].checked)isChange = true;
        if(!existOcurrenceForFonction(l, obj.objTable) && objEltDOM[l].checked)isChange = true;
    }
    return isChange
}*/
/*function existOcurrenceForFonction(nProp, listOcurrence){
    const propTable = deleteCaracteres(nProp, /[A-z]/);
    const idOnTableDef = deleteCaracteres(nProp, /[0-9]/);
    for(let lo of listOcurrence){
        if(lo[propTable] == idOnTableDef)return true;
    }
    return false;
}*/
/*async function addOrDeleteOccurrencesForFonction(obj){
    console.log(obj);
    for(let l of obj.list){
        const propTable = deleteCaracteres(l, /[A-z]/);
        const idOnTableDef = deleteCaracteres(l, /[0-9]/);
        if(existOcurrenceForFonction(l, obj.objTable) && !objEltDOM[l].checked){
            await deleteOptionForUserDB("user_" + propTable, user.id, propTable, idOnTableDef);
        }else if(!existOcurrenceForFonction(l, obj.objTable) && objEltDOM[l].checked){
            await addOptionForUserDB("user_" + propTable, user.id, propTable, idOnTableDef);
        }
    }
}*/
function setDisabledStat(nProp, value){
    try{
        objEltDOM[nProp].disabled = value;
    }catch(e){console.log(e)}
}
function setDisabledStatList(list, value){
    for(let l of list){
        setDisabledStat(l, value);
    }
}
function setValueOnDOM(nProp, value){
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
function getListColsUser(){
    const ret = [];
    for(let c of Object.keys(user)){
        if(c != "id" && c != "profil"){
            ret.push(c);
        }
    }
    return ret;
}
async function getDataForUser(nomTable, id){
    return await getDataForUserDB(nomTable, id).then(datasSQL => {
        const datas = [];
        for(let d of datasSQL){
            datas.push(d);
        }
        return datas;
    })
}