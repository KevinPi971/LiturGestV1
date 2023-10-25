//  Constantes
const nameMonth = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];

//  Fonction de gestion des formats
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
function formatMdp(){
    return objEltDOM.mdp.value.match(/[A-Z]/) == null
        || objEltDOM.mdp.value.match(/[a-z]/) == null
        || objEltDOM.mdp.value.match(/[0-9]/) == null
        || objEltDOM.mdp.value.length < 8
        || objEltDOM.mdp.value.length > 16;
}
function deleteWrongCaractere(e, pat){
    const position = e.target.selectionEnd;
    for(let i = 0; i < e.target.value.length; i++){
        if(!e.target.value[i].match(pat)){
            e.target.value = e.target.value.substring(0, i) + e.target.value.substring(i+1);
            e.target.selectionStart = position-1;
            e.target.selectionEnd = position-1;
            i--;
        }
    }
}
function deleteCaracteres(word, pat){
    let goodWord = word;
    for(let i = 0; i < goodWord.length; i++){
        if(!goodWord[i].match(pat)){
            goodWord = goodWord.substring(0, i) + goodWord.substring(i+1);
            i--;
        }
    }
    return goodWord;
}
function formatDateForSQL(date){
    return date.getFullYear() + "-" +
        ((date.getMonth() + 1) < 10 ? "0" : "") + (date.getMonth() + 1)  + "-" +
        (date.getDate() < 10 ? "0" : "") + date.getDate();
}
function formatDateFromSQLForDOM(date){
    return date.slice(0, 10);
}
function formatTimeForSQL(date){
    return date.getHours() + ":" +
        date.getMinutes() + ":" +
        date.getSeconds();
}
function formatTimeFromSQLForDOM(date){
    return date.slice(11, 16);
}
function formatDateTimeForSQL(date){
    return formatDateForSQL(date) + " " + formatTimeForSQL(date);
}
function addToListRadical(radical, prefixe, sufixe, isIndex){
    return radical.reduce(function(relai, elt, index, tab){
        relai.push((prefixe ? prefixe : "") + elt + (sufixe ? sufixe : "") + (isIndex ? index : ""));
        return relai;
    }, []);
}

//  fonctions utiles
function findRowByAttribute(list, attribute, value){
    for(let i = 0; i < list.length; i++){
        const elt = list[i];
        if(elt[attribute] == value)return elt;
    }
    return null;
}
function setCheckedListFalse(nProp, list){
    for(let l of list){
        console.log(nProp + l.id);
        objEltDOM[nProp + l.id].checked = false;
    }
}
function addPropertyOfDOM(nProp){
    objEltDOM[nProp] = document.getElementById(nProp);
}
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
function changeDisplay(form, display){
    return function(e){
        form.style.display = e.target.checked ? display :"none";
    }
}
function showElt(idShow, isActive){
    document.getElementById(idShow).style.display = isActive ? "block" : "none";
    document.getElementById("mask").style.display = isActive ? "block" : "none";
}
function logout(){
    delete(sessionStorage.userCo);
    console.log(sessionStorage.userCo);
    window.location.replace("/login.html");
}

//  Récupération de données en base
async function getListId(nList){
    return await getListDB(nList).then(listSQL => {
        const list = [];
        for(let l of listSQL){
            list.push(l.id);
        }
        return list;
    })
}
function existOcurrenceForTableLink(nProp, listOcurrence){
    const propTable = deleteCaracteres(nProp, /[A-z]/);
    const idOnTableDef = deleteCaracteres(nProp, /[0-9]/);
    for(let lo of listOcurrence){
        if(lo[propTable] == idOnTableDef)return true;
    }
    return false;
}