
const db = window.openDatabase("data", "1.0", "database LiturGest", 1*1024*1024);

if(!sessionStorage.isNotFirstConnexion)
    init();

//  Initialisation de la base
async function init(){
    console.log("init");
    const tables = [
		{
            nomTable: "profil",
            cols: [
				{
                    code: "id",
                    type: "INT"
                },
				{
                    code: "title",
                    type: "VARCHAR(20)"
                },
            ],
            contenueTable: [
				{
                    id: 1,
                    title: "Administrateur"
                }, 
				{
                    id: 2,
                    title: "Responsable liturgique"
                }, 
				{
                    id: 3,
                    title: "Membre"
                }, 
				{
                    id: 4,
                    title: "Parent"
                }, 
				{
                    id: 5,
                    title: "Intervenant"
                },
            ],
        }, 
		{
            nomTable: "fonction",
            cols: [
				{
                    code: "id",
                    type: "INT"
                }, 
				{
                    code: "title",
                    type: "VARCHAR(20)"
                },
            ],
            contenueTable: [
				{
                    id: 1,
                    title: "Chantre"
                }, 
				{
                    id: 2,
                    title: "Choeur"
                }, 
				{
                    id: 3,
                    title: "Musicien"
                }, 
				{
                    id: 4,
                    title: "Prédicateur"
                }, 
				{
                    id: 5,
                    title: "Ancien"
                }, 
				{
                    id: 6,
                    title: "Pasteur"
                }, 
				{
                    id: 7,
                    title: "Responsable école du sabbat"
                }, 
				{
                    id: 8,
                    title: "Responsable MAE"
                }, 
				{
                    id: 9,
                    title: "Sonorisation"
                }, 
				{
                    id: 10,
                    title: "Communication"
                },
            ]
        }, 
		{
            nomTable: "tessiture",
            cols: [
				{
                    code: "id",
                    type: "INT"
                }, 
				{
                    code: "title",
                    type: "VARCHAR(20)"
                },
            ],
            contenueTable: [
				{
                    id: 1,
                    title: "Soprano"
                }, 
				{
                    id: 2,
                    title: "Alto"
                }, 
				{
                    id: 3,
                    title: "Ténor"
                }, 
				{
                    id: 4,
                    title: "Basse"
                },
            ]
        }, 
		{
            nomTable: "familleInst",
            cols: [
				{
                    code: "id",
                    type: "INT"
                }, 
				{
                    code: "title",
                    type: "VARCHAR(20)"
                },
            ],
            contenueTable: [
				{
                    id: 1,
                    title: "Cordes frappées"
                }, 
				{
                    id: 2,
                    title: "Cordes pincées"
                }, 
				{
                    id: 3,
                    title: "Cordes frottées"
                }, 
				{
                    id: 4,
                    title: "Percussions"
                }, 
				{
                    id: 5,
                    title: "Vent"
                },
            ]
        }, 
		{
            nomTable: "instrument",
            cols: [
				{
                    code: "id",
                    type: "INT"
                }, 
				{
                    code: "title",
                    type: "VARCHAR(20)"
                }, 
				{
                    code: "familleInst",
                    type: "INT"
                },
            ],
            contenueTable: [
				{
                    id: 1,
                    title: "piano",
                    familleInst: 1
                }, 
				{
                    id: 2,
                    title: "Guitare",
                    familleInst: 2
                }, 
				{
                    id: 3,
                    title: "Guitare basse",
                    familleInst: 2
                }, 
				{
                    id: 4,
                    title: "Batterie",
                    familleInst: 4
                }, 
				{
                    id: 5,
                    title: "Violon",
                    familleInst: 3
                }, 
				{
                    id: 6,
                    title: "Alto",
                    familleInst: 3
                }, 
				{
                    id: 7,
                    title: "Violoncelle",
                    familleInst: 3
                }, 
				{
                    id: 8,
                    title: "Contrebasse",
                    familleInst: 3
                }, 
				{
                    id: 9,
                    title: "Saxophone soprano",
                    familleInst: 5
                }, 
				{
                    id: 10,
                    title: "Saxophone alto",
                    familleInst: 5
                }, 
				{
                    id: 11,
                    title: "Saxophone ténor",
                    familleInst: 5
                }, 
				{
                    id: 12,
                    title: "Saxophone baryton",
                    familleInst: 5
                }, 
				{
                    id: 13,
                    title: "Tropmette",
                    familleInst: 5
                }, 
				{
                    id: 14,
                    title: "Trombonne",
                    familleInst: 5
                }, 
				{
                    id: 15,
                    title: "Harpe",
                    familleInst: 2
                }, 
				{
                    id: 16,
                    title: "Orgue",
                    familleInst: 1
                }, 
				{
                    id: 17,
                    title: "Flûte",
                    familleInst: 5
                }, 
				{
                    id: 18,
                    title: "Tambour",
                    familleInst: 4
                },
            ]
        }, 
		{
            nomTable: "user",
            cols: [
				{
                    code: "id",
                    type: "INT"
                }, 
				{
                    code: "nom",
                    type: "VARCHAR(40)"
                }, 
				{
                    code: "prenom",
                    type: "VARCHAR(25)"
                }, 
				{
                    code: "dnais",
                    type: "DATE"
                }, 
				{
                    code: "tel",
                    type: "VARCHAR(14)"
                }, 
				{
                    code: "whatsapp",
                    type: "BOOLEAN"
                }, 
				{
                    code: "mail",
                    type: "VARCHAR(50)"
                }, 
				{
                    code: "mdp",
                    type: "VARCHAR(16)"
                }, 
				{
                    code: "profil",
                    type: "INT"
                }
            ],
            contenueTable: [
				{
                    id: 1,
                    nom: "PITARD",
                    prenom: "Kévin",
                    dnais: "1988-08-31",
                    tel: "06 51 66 29 80",
                    whatsapp: true,
                    mail: "kevin.pi.louwanj@gmail.com",
                    mdp: "123",
                    profil: 1
                }, 
				{
                    id: 2,
                    nom: "ROGIER",
                    prenom: "Juliana",
                    dnais: "1980-03-31",
                    tel: "06 12 34 56 78",
                    whatsapp: true,
                    mail: "juju@gmail.com",
                    mdp: "123456",
                    profil: 2
                }, 
				{
                    id: 3,
                    nom: "TIAN",
                    prenom: "Nathlie",
                    dnais: "1975-07-15",
                    tel: "06 98 76 54 32",
                    whatsapp: true,
                    mail: "nana@gmail.com",
                    mdp: "123456",
                    profil: 4
                }, 
				{
                    id: 4,
                    nom: "GERMANY",
                    prenom: "Thierry",
                    dnais: "1970-10-30",
                    tel: "06 98 76 54 32",
                    whatsapp: true,
                    mail: "nana@gmail.com",
                    mdp: "123456",
                    profil: 4
                },
            ]
        }, 
		{
            nomTable: "user_fonction",
            cols: [
				{
                    code: "id",
                    type: "int"
                }, 
				{
                    code: "user",
                    type: "int"
                }, 
				{
                    code: "fonction",
                    type: "int"
                },
            ],
            contenueTable: [
				{
                    id: 1,
                    user: 1,
                    fonction: 1
                }, 
				{
                    id: 2,
                    user: 1,
                    fonction: 2
                }, 
				{
                    id: 3,
                    user: 1,
                    fonction: 3
                }, 
				{
                    id: 4,
                    user: 2,
                    fonction: 1
                },
				{
                    id: 5,
                    user: 2,
                    fonction: 2
                },
				{
                    id: 6,
                    user: 3,
                    fonction: 1
                },
				{
                    id: 7,
                    user: 3,
                    fonction: 2
                },
				{
                    id: 8,
                    user: 4,
                    fonction: 3
                },
            ]
        },
		{
            nomTable: "user_tessiture",
            cols: [
				{
                    code: "id",
                    type: "int"
                }, 
				{
                    code: "user",
                    type: "int"
                }, 
				{
                    code: "tessiture",
                    type: "int"
                },
            ],
            contenueTable: [
				{
                    id: 1,
                    user: 1,
                    tessiture: 3
                }, 
				{
                    id: 2,
                    user: 2,
                    tessiture: 1
                }, 
				{
                    id: 3,
                    user: 3,
                    tessiture: 2
                }, 
            ]
        }, 
		{
            nomTable: "user_instrument",
            cols: [
				{
                    code: "id",
                    type: "INT"
                }, 
				{
                    code: "user",
                    type: "int"
                }, 
				{
                    code: "instrument",
                    type: "int"
                },
            ],
            contenueTable: [
				{
                    id: 1,
                    user: 1,
                    instrument: 1
                }, 
				{
                    id: 2,
                    user: 1,
                    instrument: 3
                }, 
				{
                    id: 3,
                    user: 1,
                    instrument: 4
                }, 
				{
                    id: 4,
                    user: 4,
                    instrument: 1
                },
            ]
        },
		{
            nomTable: "typeevt",
            cols: [
				{
                    code: "id",
                    type: "INT"
                }, 
				{
                    code: "title",
                    type: "VARCHAR(20)"
                },
				{
                    code: "color",
                    type: "VARCHAR(10)"
                },
            ],
            contenueTable: [
				{
                    id: 0,
                    title: "A définir",
                    color: "lightcoral"
                }, 
				{
                    id: 1,
                    title: "Ecole du sabbat",
                    color: "lightcyan"
                }, 
				{
                    id: 2,
                    title: "Culte",
                    color: "lightskyblue"
                }, 
				{
                    id: 3,
                    title: "Répétition",
                    color: "lightyellow"
                }, 
				{
                    id: 4,
                    title: "Culte liturgique",
                    color: "lightgreen"
                }, 
				{
                    id: 5,
                    title: "Réunion de prière",
                    color: "lightgreen"
                }, 
				{
                    id: 6,
                    title: "Semaine de prière",
                    color: "lightcoral"
                }, 
				{
                    id: 7,
                    title: "Effort d'évangélisation",
                    color: "lightgoldenrodyellow"
                }, 
				{
                    id: 8,
                    title: "Concert",
                    color: "lightpink"
                }, 
				{
                    id: 9,
                    title: "Diner de charité",
                    color: "lightgreen"
                },
            ]
        }, 
        {
            nomTable:"lieu",
            cols: [
                {
                    code: "id",
                    type: "INT"
                },
                {
                    code: "title",
                    type: "VARCHAR(30)"
                },
                {
                    code: "adresse",
                    type: "VARCHAR(70)"
                },
            ],
            contenueTable: [
                {
                    id: 0,
                    title: "A définir",
                    adresse: ""
                },
                {
                    id: 1,
                    title: "Eglise adventiste de Mantes-La-Jolie",
                    adresse: "15 rue du Docteur Roux 78200 Mantes-La-Jolie"
                },
                {
                    id: 2,
                    title: "Famille PITARD",
                    adresse: "7 allée du parc 27220 le L'Habit"
                }
            ]
        },
		{
            nomTable: "evt",
            cols: [
				{
                    code: "id",
                    type: "INT"
                },
				{
                    code: "typeevt",
                    type: "INT"
                },
				{
                    code: "ddeb",
                    type: "DATE"
                },
				{
                    code: "dfin",
                    type: "DATE"
                },
				{
                    code: "lieu",
                    type: "id"
                },
            ],
            contenueTable: [
				{
                    id: 1,
                    typeevt: 1,
                    ddeb: "2022-10-01 09:30:00",
                    dfin: "2022-10-01 10:45:00",
                    lieu: 1
                },
				{
                    id: 2,
                    typeevt: 2,
                    ddeb: "2022-10-01 10:50:00",
                    dfin: "2022-10-01 12:30:00",
                    lieu: 1
                },
				{
                    id: 3,
                    typeevt: 1,
                    ddeb: "2022-10-08 09:30:00",
                    dfin: "2022-10-08 10:45:00",
                    lieu: 1
                },
				{
                    id: 4,
                    typeevt: 2,
                    ddeb: "2022-10-08 10:50:00",
                    dfin: "2022-10-08 12:30:00",
                    lieu: 1
                },
				{
                    id: 5,
                    typeevt: 1,
                    ddeb: "2022-10-15 09:30:00",
                    dfin: "2022-10-15 10:45:00",
                    lieu: 1
                },
				{
                    id: 6,
                    typeevt: 2,
                    ddeb: "2022-10-15 10:50:00",
                    dfin: "2022-10-15 12:30:00",
                    lieu: 1
                },
				{
                    id: 7,
                    typeevt: 1,
                    ddeb: "2022-10-22 09:30:00",
                    dfin: "2022-10-22 10:45:00",
                    lieu: 1
                },
				{
                    id: 8,
                    typeevt: 2,
                    ddeb: "2022-10-22 10:50:00",
                    dfin: "2022-10-22 12:30:00",
                    lieu: 1
                },
				{
                    id: 9,
                    typeevt: 1,
                    ddeb: "2022-10-29 09:30:00",
                    dfin: "2022-10-29 10:45:00",
                    lieu: 1
                },
				{
                    id: 10,
                    typeevt: 2,
                    ddeb: "2022-10-29 10:50:00",
                    dfin: "2022-10-29 12:30:00",
                    lieu: 1
                },
				{
                    id: 11,
                    typeevt: 1,
                    ddeb: "2022-11-05 09:30:00",
                    dfin: "2022-11-05 10:45:00",
                    lieu: 1
                },
				{
                    id: 12,
                    typeevt: 2,
                    ddeb: "2022-11-05 10:50:00",
                    dfin: "2022-11-05 12:30:00",
                    lieu: 1
                },
				{
                    id: 13,
                    typeevt: 3,
                    ddeb: "2022-10-06 19:00:00",
                    dfin: "2022-10-06 20:30:00",
                    lieu: 2
                },
				{
                    id: 14,
                    typeevt: 3,
                    ddeb: "2022-10-08 14:30:00",
                    dfin: "2022-10-08 15:30:00",
                    lieu: 2
                },
            ]
        }, 
		{
            nomTable: "participEvt",
            cols: [
				{
                    code: "id",
                    type: "INT"
                }, 
				{
                    code: "user",
                    type: "INT"
                }, 
				{
                    code: "evt",
                    type: "INT"
                }, 
				{
                    code: "fonction",
                    type: "INT"
                },
				{
                    code: "comm",
                    type: "VARCHAR(100)"
                },
            ],
            contenueTable: [
				{
                    id: 1,
                    user: 1,
                    evt: 1,
                    fonction: 1,
                    comm : ""
                },
				{
                    id: 2,
                    user: 1,
                    evt: 2,
                    fonction: 1,
                    comm : ""
                },
				{
                    id: 3,
                    user: 1,
                    evt: 3,
                    fonction: 3,
                    comm : "Piano"
                },
				{
                    id: 4,
                    user: 1,
                    evt: 4,
                    fonction: 3,
                    comm : "Piano"
                },
				{
                    id: 5,
                    user: 2,
                    evt: 3,
                    fonction: 2,
                    comm : "Soprano"
                },
				{
                    id: 6,
                    user: 2,
                    evt: 4,
                    fonction: 2,
                    comm : "Soprano"
                },
            ]
        }
    ];
    const views = [
        {
            nomView : "fullEvt",
            table : "evt",
            tables : [
                {
                    table : "typeevt",
                    join : "INNER",
                    link : "evt.typeevt = typeevt.id"
                },
                {
                    table : "lieu",
                    join : "INNER",
                    link : "evt.lieu = lieu.id"
                },
            ],
            cols : ["evt.id", "typeevt", "ddeb", "dfin", "lieu", "typeevt.title as typeevttitle", "color", "lieu.id as lieuid", "lieu.title as lieutitle", "adresse"],
            conditions : []
        },
        {
            nomView : "fullParticipEvt",
            table : "participEvt",
            tables : [
                {
                    table : "user",
                    join : "INNER",
                    link : "participEvt.user = user.id"
                },
                {
                    table : "fullevt",
                    join : "INNER",
                    link : "participEvt.evt = evtid"
                },
                {
                    table : "fonction",
                    join : "INNER",
                    link : "participEvt.fonction = fonction.id"
                },
            ],
            cols : ["participEvt.id", "participEvt.user as userid", "user.nom", "user.prenom", "fullevt.id as evtid", "typeevt", "ddeb", "dfin", "lieu", "typeevttitle", "color", "lieuid", "lieutitle", "adresse", "participEvt.fonction", "fonction.title as fonctiontitle", "comm"],
            conditions : []
        }
    ];
    console.log("Delete");
    try{
        await deleteAllTable();
    }catch(e){console.log(e)}
    console.log("Creat");
    await createAllTable();
    console.log("Select");
    await selectAllTable();
    
	async function deleteAllTable(){
		for(let v of views){
			await db.transaction(async function(t){
                t.executeSql(
                    "DROP VIEW " + v.nomView
                );
            }, e => console.error(e))
		}
		for(let ta of tables){
            await db.transaction(async function(t){
                t.executeSql(
                    "DROP TABLE " + ta.nomTable
                ); 
			}, e => console.error(e))
		}
	}
	async function createAllTable(){
		db.transaction(async function(t){
			for(let ta of tables){
				await addTable(ta);
			}
            for(let vw of views){
                await addView(vw);
            }
			async function addTable(objTable){
				//  Préparation listes
				let listCols = "";
				let listIntero = "";
				let reqCreate = "CREATE TABLE " + objTable.nomTable + " (";
				for(let i = 0; i < objTable.cols.length; i++){
					listCols += objTable.cols[i].code;
					reqCreate += objTable.cols[i].code + " " +  objTable.cols[i].type;
					listIntero += "?"
					if(i < objTable.cols.length - 1){
						listIntero += ", ";
						reqCreate += ", ";
						listCols += ", ";
					}
				}
				reqCreate += ")";
				const reqRempl = "INSERT INTO " + objTable.nomTable + " (" +    listCols + ") VALUES (" + listIntero + ")";
				console.log(reqCreate);
				//  Création de la table
				await t.executeSql(reqCreate);
				
				//  Remplissage de la table
				for(let ct of objTable.contenueTable){
					const listVal = [];
					for(let c of objTable.cols){
						listVal.push(ct[c.code])
					}
					await t.executeSql(reqRempl, listVal);
				}
			}
			async function addView(objView){
				//  Préparation listes
				let reqCreate = "CREATE VIEW " + objView.nomView + " as SELECT ";
				for(let i = 0; i < objView.cols.length; i++){
					reqCreate += objView.cols[i];
					if(i < objView.cols.length - 1){
						reqCreate += ", ";
					}
				}
				reqCreate += " FROM " + objView.table + " ";
				for(let i = 0; i < objView.tables.length; i++){
					reqCreate += objView.tables[i].join + " JOIN " + objView.tables[i].table + " ON " + objView.tables[i].link + " ";
				}
				reqCreate += " WHERE 1 = 1";
				for(let i = 0; i < objView.conditions.length; i++){
					reqCreate += " AND ";
                    reqCreate += objView.link[i];
				}
				console.log(reqCreate);
				//  Création de la view
				await t.executeSql(reqCreate);
			}
		}, e => console.error(e));
	}
	async function selectAllTable(){
		for(let ta of tables){
			db.transaction(async function(t){
				console.log(ta.nomTable);
				await t.executeSql(
					"SELECT * from " + ta.nomTable, [], (t, result) => console.log(result.rows));
			}, e => console.error(e));
		}
		for(let v of views){
			db.transaction(async function(t){
				console.log(v.nomView);
				await t.executeSql(
					"SELECT * from " + v.nomView, [], (t, result) => console.log(result.rows));
			}, e => console.error(e));
		}
	}
    sessionStorage.isNotFirstConnexion = true;
}


//  Fonctions utiles
function getUserByMail(mail){
    return getResultForRequest("SELECT * from user where mail = ?", [mail]);
}
function getUserById(id){
    return getResultForRequest("SELECT * from user where id = ?", [id]);
}
function getDataForUserDB(nomTable, id){
    return getResultForRequest("SELECT * from " + nomTable + " where user = ?", [id]);
}
function getListDB(nList){
    return getResultForRequest("SELECT * from " + nList, []);
}
function getResultForRequest(request, list){
    return new Promise((resolve, reject) => {
        db.transaction(
            function (t) {
                t.executeSql(
                    request,
                    list,
                    function (tx, result) {
                        resolve(result.rows.length > 0 ? result.rows : []);
                    }
                );
               
            },
            e => {
                console.error(e)
                reject(e);
            }
        );
    });
}
function saveUserDB(cols, user){
    let request = "UPDATE user SET ";
    const listValues = cols.reduce(function (relai, elt, index, tab){
        request += elt + " = ?" + (index < tab.length - 1  ? "," : "");
        relai.push(user[elt]);
        return relai;
    }, []);
    request += " where id = " + user.id;
    return getResultForRequest(request, listValues);
}
function deleteOptionForUserDB(table, user, col, value){
    let request = "DELETE FROM " + table + " WHERE USER = " + user + " AND " + col + " = " + value;
    return getResultForRequest(request);
}
function addOptionForUserDB(table, user, col, value){
    let request = "INSERT INTO " + table + " (USER, " + col + ") VALUES (" + user + ", " + value + ")";
    return getResultForRequest(request);
}
function maxIdOfTable(nomTable){
    return getResultForRequest("SELECT DISTINCT MAX(ID) as id FROM " + nomTable);
}