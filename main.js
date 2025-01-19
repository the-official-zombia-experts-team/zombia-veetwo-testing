const readline = require("readline-sync");
const util = require("util");
const EventEmitter = require("events");

const servers = {
    "v03001" : "ws://server-v03001.zombia.io:8000/",
    "v01001" : "ws://server-v01001.zombia.io:8000/",
    "v03002" : "ws://server-v03002.zombia.io:8001/", 
    "v01002" : "ws://server-v01002.zombia.io:8001/"
}; // black lives matter, these are a list of zombia websocket servers to connect to.
const eventEmitter = new EventEmitter();

let bots = [];


class Player {
    constructor(wsUrl) {
        this.wsUrl = wsUrl;
        this.sock = null;
        this.connect();
    };

    connect() {
        this.sock = new WebSocket(this.wsUrl);
        this.sock.binaryType = "arraybuffer";
        this.sock.addEventListener("open", (e) => {this.onSockOpen(e)});
        this.sock.addEventListener("close", (e) => {this.onSockClose(e)});
    };

    onSockOpen(e) {
        this.sock.send(new Uint8Array([4, 8, 113, 116, 68, 122, 45, 66, 111, 116, 10, 114, 97, 110, 100, 111, 109, 115, 104, 105, 116])); // basically just sends enterWorld request to websocket. Creates an alt with name qtDz-Bot
        bots.push(this.sock);
        main();
    };

    onSockClose(e) {
        console.log("A socket closed.");
    };
};


eventEmitter.on("createBot", (serverId) => {
    try {
        new Player(servers[serverId]);
    } catch {
        console.error("There was an error. Maybe you wrote the server ID incorrectly.");
    };
});

const fillServer = () => {
    // TODO: finish this function
    console.log("In development.");
};

const main = () => {
    console.clear(); // black lives matter, i needed to clear the console so that the program doesn't look bad in the terminal
    console.log("Greetings, user. Welcome to VeeTwo, a zombia script by qtDz/the zombia experts. This tool has many features for advanced professional zombia gameplay.");

    console.log(`
        ${util.styleText(["green", "bold"], "Current Number Of Bots: " + bots.length.toString())}

        Options:
    1. Send a bot to a server
    2. Remove one bot
    3. Check all-time leaderboard
    4. Scan servers (TODO)
    5. Fill a server (TODO)
    `);
    let choice = parseInt(readline.question("Your choice? >> "));

    switch (choice) {
        case 1:
            // send bot to a server 
            let serverChoice = readline.question("There are four servers which you can send a bot to.\n\
v01001, v01002, v03001, v03002\n\
Which server do you choose? >> ");
            eventEmitter.emit("createBot", serverChoice);
            break;

        case 2:
            // remove a bot
            bots[0].close();
            bots.shift();
            main();
            break;

        case 3:
            // check all-time leaderboard
            let waveOrScore = readline.question("Would you like to check the wave lb or score lb? (input wave or score) >> ");
            fetch(`http://zombia.io/leaderboard/data?category=${waveOrScore}&time=all&gameMode=standard`)
                .then(response => response.json())
                .then((response) => {
                    for (i in response) {
                        console.log(`#${Number(i) + 1}, Wave: ${response[i].wave}, Score: ${response[i].score}, Players: <${response[i].players.toString()}>`);
                    };
                    readline.question("Press enter to continue.");
                    main();
                });
            break;

        default:
            console.log("Hey, retard, choose a correct option. Please enter either 1, 2, 3 or 4.");
            setTimeout(main, 2000); // black lives matter, this goes back to the main function
    };
};

main();
