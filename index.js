const Discord = require("discord.js");

const Client = new Discord.Client;

Client.db = require('./db.json')

const ytdl = require("ytdl-core");

const prefix = "!m";


Client.on("ready", () => {
    //PLAYING(joue à), LISTENING(écoute), COMPETING(participant à), WATCHING(regarde),STREAMING(marche ( mais pas de bouton regardé)( on peut ajouté aussi: Client.user.setActivity("ce que tu veux", {type: "PLAYING", url: "le lien"}))
    Client.user.setActivity("!mhelp", {type: "PLAYING"})
    console.log("Le Bot Night ( bot normal et modération)");
});
Client.on("message", message => {
    message.mentions.members.array().forEach(element => {
        if (element.id == Client.user.id) {
            message.channel.send(`Le prefix actuel de ${Client.user.username} est '**${prefix}**' exemple: ${prefix}help`);
        }
    });

    if(message.content.startsWith(prefix + "help")) {
        var embed = new Discord.MessageEmbed()
        
        .setTitle("Night Bot ( clique sur moi pour m'invité !")
        //le set url permet de mettre une lien à l'intérieur du .setTitle
        .setURL("https://discord.com/api/oauth2/authorize?client_id=845753829127356470&permissions=8&scope=bot")
        //Ajouté , " Url" Sans oublié de suprimmer le ")" qui est après le '"'
        .setAuthor(" Night Bot Info " )
        .setDescription("Les Commandes:")
        .addField("Le prefix actuel de Night Bot est `"+prefix+"` " )
        //false = en dessous true = coller 
        // ajoute .addField("/u200B", "/u200B" , false) pour mettre une grosse espace
        .addField("Pour effectuer des commandes avec moi " , " faut écrire mon prefix en premier puis après la commande Exemple: "+prefix+"help", false)
        .addField("Je peux effectuer des commandes de modérations comme : ", " clear  ( je ne peux pas suppremier le nombre de message plus de 100), kick , mute , ban", false)
        .addField("Tu peux aussi me faire jouer de la musique ! ", prefix+"play **url** et "+prefix+"stop (attention dans ma commande play je marche mais je risque d'être lent désolé) " , false )
        .setTimestamp()
        //texte de fin (.setFooter("") )
        message.channel.send(embed);
    }

    if(message.content.startsWith(prefix + "play")){
        if(message.member.voice.channel){
            message.member.voice.channel.join().then(connection => {
                let args = message.content.split(" ");

                if(!args[1]){
                    message.reply("Lien de la vidéo non disponible");
                    connection.discord();
                }
                else {
                    let dispatcher = connection.play(ytdl(args[1], { quality: "highestaudio"}));

                 dispatcher.on("finish", () => {
                     dispatcher.destroy();
                     connection.disconnect();

                    });
                    
                 dispatcher.on("error", err => {
                     console.log("erreur de dispatcher : " + err);
                });
            }     
            }).catch(err => {
                message.reply("Erreur lors de la connexion : " + err);
            });
        }
        else {
                message.reply("Vous n'êtes pas connecté en vocal.");
        }
    }
    if (message.content == prefix + "stop"){
        let member = message.guild.members.cache.get(Client.user.id)
        if (member.voice.channel) member.voice.channel.leave()
        message.reply("J'ai bien quitté le channel jespère que tu as aimé la musique =)");
        }
    if(message.member.permissions.has("MANAGE_MESSAGES")){
        if(message.content.startsWith(prefix + "clear")){
            let args = message.content.split(" ");
            if(args[1] == undefined) {
                message.reply("Nombre de message ou mal défini.");
            }
            else {
                let number = parseInt(args[1]);
                
                if(isNaN(number)){
                    message.reply("Nombre De message non défini ou non connu.");
                }
                else {
                    message.channel.bulkDelete(number).then(messages => {
                        console.log("Suppression de " + message.size + "message avec succès !");
                    }).catch(err => {
                        console.log("Erreur de suppresion des messages :" + err);
                   })

                }
            }
        }
    }

    if(message.author.bot) return;
    if(message.channel.type == "dm") return;

    if(message.member.hasPermission("ADMINISTRATOR")){
        if(message.content.startsWith(prefix + "ban")){
            let mention = message.mentions.members.first();

            if(mention == undefined){
                message.reply("Membre non ici ou il est plus élevé que toi.");
            }
            else {
                 if(mention.bannable){
                     mention.ban();
                     message.channel.send(mention.displayName + " Le Membre à bien été Banni avec succès")
                 }
                 else {
                     message.reply("impossible de Bannir ce membre");
                 }
            }
        }
        else if(message.content.startsWith(prefix + "kick")){
            let mention = message.mentions.members.first();

            if(mention == undefined){
                message.reply("membre non ici ou plus élevé que toi");
            }
            else {
                if(mention.kickable){
                    mention.kick();
                    message.channelsend(mention.displayName + " Le membre à bien été kick avec succès");

                }
                else {
                    message.reply("Impossible de le bannir ou kick");
                }
            }
        }
        else if(message.content.startsWith(prefix + "mute")){
            let mention = message.mentions.members.first();

            if(mention == undefined ){
                message.reply("Le membre n'a pas été mute ou il est plus élevé que toi.");
            }
            else {
                mention.roles.add("845030882851291166")
                mention.roles.remove("839891670756884510")
                message.reply(mention.displayName + " Le membre à bien été mute avec succès")
            }
        }
        else if(message.content.startsWith(prefix + "unmute")){
            let mention = message.mentions.members.first();

                if(mention == undefined ){
                    message.reply("Le membre n'a pas été Unmute ou il est plus élevé que toi.");
                }
                else {
                    mention.roles.remove("845030882851291166")
                    mention.roles.add("839891670756884510")
                    message.channel.send(mention.displayName + " Le membre à bien été Unmute avec succès")
            }
        }
    }
});
Client.login(process.env.TOKEN);