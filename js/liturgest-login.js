const eltForm = document.getElementById("formLogin");
const eltMail = document.getElementById("mail");
const eltMDP = document.getElementById("mdp");
const eltBadLog = document.getElementById("badLog");
let nbCo = 0;

eltForm.addEventListener("submit", function(e){
    e.preventDefault();
    isLoginOk();
});


async function isLoginOk(){
    let isOk = true;
    //  Récupération du user
    const user = await getUserByMail(eltMail.value).then(l => {
        console.log(l);
        return l.length == 1 ? l[0] : null;
    });
    if(user == null)isOk = false;
    if(isOk && eltMDP.value != user.mdp)isOk = false;
    if(isOk){
        sessionStorage.userCo = JSON.stringify(user);
        eltForm.submit();
    }else{
        eltBadLog.style.display = "inline";
        nbCo++;
    }
}

