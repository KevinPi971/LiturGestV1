if(!sessionStorage.userCo)window.location.replace("/login.html");
const objEltDOM = {};
let user = {};
let month;
let year;
let firstDayOfMonth;
let lastDayOfMonth;
let firstDateOfSchedule;
let lastDateOfSchedule;
let listEvts = [];
let listEltShowDom = [];
let currentEvt = {}
let listLieu = [];
let listFonction = [];

initPage();
async function initPage(){
    //  Récupération du user
    user = JSON.parse(sessionStorage.userCo);
    
    const today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    
    const listDateDOM = ["mois", "annee"];
    const listCardDOM = getListNameCard();
    listEltShowDom = ["typeevt", "ddeb", "hdeb", "dfin", "hfin", "duree", "lieu", "adresse", "listParticip"];
    
    
    //  Initialisation de l'objet contenant les éléments du DOM
    const listEltDOM = ["formEvt", "saveEvt", "deleteEvt"]
        .concat(listDateDOM)
        .concat(listCardDOM)
        .concat(listEltShowDom);
    for(let lp of listEltDOM){
        addPropertyOfDOM(lp);
    }
    
    objEltDOM.formEvt.addEventListener("submit", saveOrDeleteEvt());
    objEltDOM.formEvt.addEventListener("change", isChangeEvt);
    
    addTableOnSelect("typeevt");
    addTableOnSelect("lieu");
    listLieu = await getListDB("lieu");
    listFonction = await getListDB("fonction");
    objEltDOM.lieu.addEventListener("change", updateAdresse());
    majDOM();
}

function setCardDayClass(nProp, active){
    objEltDOM[nProp].className = active ? "cardDayOn" : "cardDayOff";
}
function setListCardDayClass(list, active){
    for(let l of list){
        setCardDayClass(l, active);
    }
}
function getListNameCard(){
    const list = [];
    for(let i = 0; i < 42; i++){
        list.push("card" + i);
    }
    return list;
}
function getListNameCardActive(){
    const list = [];
    const firstDay = firstDayOfMonth.getDay();
    const lastDay = lastDayOfMonth.getDate();
    for(let i = firstDay; i < lastDay + firstDay; i++){
        list.push("card" + i);
    }
    return list;
}
function setDayOnCardDay(list){
    const firstDay = firstDayOfMonth.getDay();
    const lastDay = lastDayOfMonth.getDate();
    const lastDayNum = lastDayOfMonth.getDay();
    const lastDayOfLastMonth = new Date(year, month, 0);
    const firstDayOfNextMonth = new Date(year, month + 1, 1);
    
    firstDateOfSchedule = new Date(
        firstDay == 0 ? year : lastDayOfLastMonth.getFullYear(),
        firstDay == 0 ? month : lastDayOfLastMonth.getMonth(),
        firstDay == 0 ? 1 : lastDayOfLastMonth.getDate() - firstDay + 1
    );
    
    lastDateOfSchedule = lastDayNum == 6 ? lastDayOfMonth : new Date(
        firstDayOfNextMonth.getFullYear(),
        firstDayOfNextMonth.getMonth() + 1,
        7 - lastDayNum
    );
    
    
    for(let i = firstDay - 1; i >= 0; i--){
        objEltDOM["card" + i].cardProps = {
            numCard: i,
            isActive: false,
            date : new Date(
                lastDayOfLastMonth.getFullYear(),
                lastDayOfLastMonth.getMonth(),
                lastDayOfLastMonth.getDate() + i - firstDay + 1
            ),
        };
    }
    for(let i = firstDay; i < lastDay + firstDay; i++){
        objEltDOM["card" + i].cardProps = {
            numCard : i,
            isActive: true,
            date : new Date(
                year,
                month,
                i - firstDay + 1
            )
        };
    }
    for(let i = firstDay + lastDay; i < 42; i++){
        objEltDOM["card" + i].cardProps = {
            numCard : i,
            isActive: false,
            date : new Date(
                firstDayOfNextMonth.getFullYear(),
                firstDayOfNextMonth.getMonth(),
                i - lastDay - firstDay + 1
            )
        };
    }
    
    // Gestion affichage semaines optionnelles
    const nbWeek = (firstDay + lastDay) / 7;
    if(nbWeek <= 5){
        document.getElementById("week6").style.display = "none";
    }else{
        document.getElementById("week6").style.display = "table-row";
    }
    if(nbWeek <= 4){
        document.getElementById("week5").style.display = "none";
    }else{
        document.getElementById("week5").style.display = "table-row";
    }
}
function placeDaysOnSchedule(){
    const listDayActive = getListNameCardActive();
    setListCardDayClass(listDayActive, true);
    setDayOnCardDay(listDayActive);
}
function changeMonthOrYear(mode){
    switch(mode){
        case "prevMonth":
            month--;
            if(month < 0){
                month = 11;
                year--;
            }
            break;
        case "nextMonth":
            month++;
            if(month > 11){
                month = 0;
                year++;
            }
            break;
        case "prevYear":
            year--;
            break;
        case "nextYear":
            year++;
            break;
    }
    majDOM();
}
function majDOM(){
    setListCardDayClass(getListNameCard(), false);
    firstDayOfMonth = new Date(year, month, 1);
    lastDayOfMonth = new Date(year, month + 1, 0);
    objEltDOM.mois.innerHTML = nameMonth[month];
    objEltDOM.annee.innerHTML = year;
    placeDaysOnSchedule();
    addEvtOnSchedule();
}
async function addEvtOnSchedule(){
    listEvts = await getEvtsByDates(firstDateOfSchedule, lastDateOfSchedule);
    for(let lnc of getListNameCard()){
        let contenu = "<div>" + objEltDOM[lnc].cardProps.date.getDate() + "</div>";
        for(let eod of getEvtOfDate(objEltDOM[lnc].cardProps.date)){
            if(!objEltDOM[lnc].cardProps.isActive){
                contenu += "<div class='cardEvt'>" + eod.typeevttitle + "</div>"
            }else{
                contenu += "<input type='button' class='cardEvt' style='background-color: " + eod.color + "' value='" + eod.typeevttitle + "' onclick='showEvt(" + eod.id + ")'/>"
            }
            
            
        }
        if(objEltDOM[lnc].cardProps.isActive){
            contenu += "<br><input type='button' class='addButton' value='+' onclick='addEvtWithDate(\"" + formatDateForSQL(objEltDOM[lnc].cardProps.date) + "\")' />"
        }
        objEltDOM[lnc].innerHTML = contenu;
    }
}
function getEvtOfDate(date){
    const list = [];
    for(let le of listEvts){
        if(le.ddeb.slice(0, 10) == formatDateForSQL(date)){
            list.push(le);
        }
    }
    return list;
}
async function getEvtsByDates(ddeb, dfin){
    const request = "SELECT * FROM FULLEVT WHERE DDEB > '" + formatDateForSQL(ddeb) + "' AND DFIN < '" + formatDateForSQL(dfin) + "' ORDER BY DDEB";
    return await getResultForRequest(request);
}
function getEvtById(idEvt){
    for(let le of listEvts){
        if(le.id == idEvt)return le;
    };
}
async function showEvt(idevt){
    showElt("showEvt", true);
    currentEvt = getEvtById(idevt);
    await addListParticipOnCurrentEvt();
    setEvtOnDOM(currentEvt);
    objEltDOM.saveEvt.disabled = true;
    objEltDOM.deleteEvt.style.display = "inline";
}
async function addListParticipOnCurrentEvt(){
    currentEvt.listParticip = await getParticipEvtByEvt(currentEvt.id);
}
async function setEvtOnDOM(objEvt){
    objEltDOM.typeevt.value = objEvt == null ? "" : currentEvt.typeevt;
    objEltDOM.ddeb.value = objEvt == null ? "" : formatDateFromSQLForDOM(currentEvt.ddeb);
    objEltDOM.hdeb.value = objEvt == null ? "" : formatTimeFromSQLForDOM(currentEvt.ddeb);
    objEltDOM.dfin.value = objEvt == null ? "" : formatDateFromSQLForDOM(currentEvt.dfin);
    objEltDOM.hfin.value = objEvt == null ? "" : formatTimeFromSQLForDOM(currentEvt.dfin);
    objEltDOM.lieu.value = objEvt == null ? "" : currentEvt.lieu;
    objEltDOM.adresse.value = objEvt == null ? "" : currentEvt.adresse;
    objEltDOM.listParticip.innerHTML = "<tr><th class='listParticip'>Nom</th><th class='listParticip'>Prénom</th><th class='listParticip'>Fonction</th><th class='listParticip'>Commentaires</th><th class='listParticip'>Supprimer</th></tr>";
    if(objEvt != null){
        for(let lp of objEvt.listParticip){
            addParticipOnTable(lp);
        }
        objEltDOM.listParticip.newId = await maxIdOfTable("participEvt");
        console.log(objEltDOM.listParticip.newId);
        //addParticipOnTable(createNewParticipObj());
        for(let lp of objEvt.listParticip){
            const sel = document.getElementById("listParticipFonction" + lp.id);
            sel.value = lp.fonction;
        }
    }
}
function getOptionOnSelectForDOM(list){
    let ret = "";
    for(let l of list){
        ret += "<option value='" + l.id + "'>" + l.title + "</option>"
    }
    return ret;
}
async function addTableOnSelect(nProp){
    let list = await getListDB(nProp);
    addListOnSelect(nProp, list);
}
function addListOnSelect(nProp, list){
    objEltDOM[nProp].innerHTML = getOptionOnSelectForDOM(list);
}
function saveOrDeleteEvt(){
    return async function(e){
        e.preventDefault();
        let request;
        if(e.submitter.id == "deleteEvt") {
            request = "DELETE FROM EVT WHERE ID = " + currentEvt.id;
            console.log("Il faudra gérer la suppression des participants.");
        }else if(currentEvt != null && e.submitter.id == "saveEvt"){
            request = "UPDATE EVT SET TYPEEVT = " + objEltDOM.typeevt.value + ", " +
                "DDEB = '" + objEltDOM.ddeb.value + " " + objEltDOM.hdeb.value + "', " + 
                "DFIN = '" + objEltDOM.dfin.value + " " + objEltDOM.hfin.value + "', " + 
                "LIEU = " + objEltDOM.lieu.value + " " +
                "WHERE ID = " + currentEvt.id;
            console.log("Il faudra gérer l'ajout des participants.");
        }else if(currentEvt == null && e.submitter.id == "saveEvt"){
            const res = await maxIdOfTable("evt");
            const newId = res[0].id + 1;
            request = "INSERT INTO EVT (ID, TYPEEVT, DDEB, DFIN, LIEU) VALUES (" + 
                newId + ", " +
                objEltDOM.typeevt.value + ", " +
                "'" + objEltDOM.ddeb.value + " " + objEltDOM.hdeb.value + "', " +
                "'" + objEltDOM.dfin.value + " " + objEltDOM.hfin.value + "', " +
                objEltDOM.lieu.value +
                ")";
        }
        await getResultForRequest(request);
        showElt("showEvt", false);
        majDOM();
    }
}
function addEvtWithDate(date){
    showElt("showEvt", true);
    currentEvt = null;
    setEvtOnDOM(currentEvt);
    objEltDOM.ddeb.value = formatDateFromSQLForDOM(date);
    objEltDOM.saveEvt.disabled = false;
    objEltDOM.deleteEvt.style.display = "none";
}
function addParticipOnTable(lp){
    objEltDOM.listParticip.innerHTML += 
       "<tr id='listParticip" + lp.id + "'>" +
           "<td class='listParticip' id='listParticipNom" + lp.id + "'>" + lp.nom + "</td>" +
           "<td class='listParticip' id='listParticipPrenom" + lp.id + "'>" + lp.prenom + "</td>" +
           "<td class='listParticip'>" + 
                "<select id='listParticipFonction" + lp.id + "'  class='forms-evt'>" +
                    getOptionOnSelectForDOM(listFonction) +
                "</select>" +
            "</td>" +
            "<td class='listParticip'>" +
                "<textarea id='listParticipComm" + lp.id + "' cols='20' rows='5'>" + 
                    lp.comm + 
                "</textarea>" +
            "</td>" +
            "<td class='listParticip' style='text-align:center'>" +
                "<input type='button' value='X' class='closeButton' style='float:none' onclick='deletParticipEvtOnDom(" + lp.id + ")' />" +
            "</td>" +
        "</tr>";
}
function createNewParticipObj(){
    return {
                id: objEltDOM.listParticip.newId++,
            }
}
function addParticipOnEvt(){
    console.log("ici");
}
function deletParticipEvtOnDom(idParticip){
    console.log(idParticip);
    document.getElementById("listParticip" + idParticip).remove();
}
function updateAdresse(){
    return async function(e){
        objEltDOM.adresse.value = (await findRowByAttribute(listLieu, "id", e.target.value)).adresse;
    }
}
function hasChangeEvtShow(){
    return currentEvt == null ||
        objEltDOM.typeevt.value != currentEvt.typeevt ||
        objEltDOM.ddeb.value != formatDateFromSQLForDOM(currentEvt.ddeb) ||
        objEltDOM.hdeb.value != formatTimeFromSQLForDOM(currentEvt.ddeb) ||
        objEltDOM.dfin.value != formatDateFromSQLForDOM(currentEvt.dfin) ||
        objEltDOM.hfin.value != formatTimeFromSQLForDOM(currentEvt.dfin) ||
        objEltDOM.lieu.value != currentEvt.lieu;
}
function isChangeEvt(e){
    objEltDOM.saveEvt.disabled = !hasChangeEvtShow();
}
async function getParticipEvtByEvt(idEvt){
    return await getResultForRequest("SELECT * FROM FULLPARTICIPEVT WHERE evtid = " + idEvt);
}
