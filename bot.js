const Discord = require ("discord.js");
const client = new Discord.Client();
const config = require ("./config.json");
const firebase = require ("firebase");

var firebaseConfig = {
    apiKey: "AIzaSyA7J5FlCkQFEqbTGKr4h0rSlOLyZIU50Qo",
    authDomain: "levelingbotkimetsu.firebaseapp.com",
    databaseURL: "https://levelingbotkimetsu.firebaseio.com/",
    projectId: "levelingbotkimetsu",
    storageBucket: "levelingbotkimetsu.appspot.com",
    messagingSenderId: "36144408995",
    appId: "1:36144408995:web:84c417cf7e45efd4be5216"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();

client.on("ready", () => {
    console.log(`Bot foi iniciado, com ${client.users.size} usuários, em ${client.channels.size} canais em ${client.guilds.size} servidores.`);
    client.user.setActivity(`TREINANDO PESSOINHAS!`);
});

client.on("message", async message => {

    if(message.author.bot) return;
    if (message.channel.type === "dm") return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase();

    if (comando === "train") { 
        const randxpt = Math.random();
        const randmultxpt = (randxpt * 10) + 1;
        const xpt = Math.floor(randmultxpt);

        database.ref(`Servidores/Levels/${message.guild.id}/${message.author.id}`)
        .once('value').then(async function (db) {
            if (db.val() == null) {
                database.ref(`Servidores/Levels/${message.guild.id}/${message.author.id}`)
                .set({
                    xp: 0,
                    level: 1,
                })
                message.channel.send(`${message.author} ainda não tem um level, deixa que eu crio para você!`);
            } else {
                if (db.val().xp >= db.val().level * 50) {
                    database.ref(`Servidores/Levels/${message.guild.id}/${message.author.id}`)
                    .update({
                        xp: 0,
                        level: db.val().level + 1,
                    });

                    message.channel.send(`${message.author} upou ao level ${db.val().level+1}`);

                } else {
                    database.ref(`Servidores/Levels/${message.guild.id}/${message.author.id}`)
                    .update({
                        xp: db.val().xp + xpt,
                    })
                    const m = await message.channel.send(`${message.author} treinou e ganhou ${xpt} de experiência!`);
                }
            }
        })
    }
    
    if (comando === "lvl")
    {
        database.ref(`Servidores/Levels/${message.guild.id}/${message.author.id}`)
        .once('value').then(async function (lvlget){
            if (lvlget.val() == null) {
                database.ref(`Servidores/Levels/${message.guild.id}/${message.author.id}`)
                .set({
                    xp: 0,
                    level: 1,
                })
            message.channel.send(`${message.author} ainda não tem um level, deixa que eu crio para você!`);
            } else {
                message.channel.send(`Experiência: ${lvlget.val().xp} / ${lvlget.val().level * 150}.
Level: ${lvlget.val().level}.`);
            }
        })
    }

    if (comando === "lvlclear") {
        database.ref(`Servidores/Levels/${message.guild.id}/${message.author.id}`)
            .set({
                xp: 0,
                level: 1,
            })
        message.channel.send(`${message.author} acabou de resetar o próprio level!`);
    }
})

client.login(config.token);