const logs = document.getElementById("logDiv")
const stats = document.getElementById("stats")
var player1,player2,player3,player4
var players = []

var playercount = 8 // has to be 8 or less

const availableNames = [
    "dog", "battleship", "race car", "top hat", "cat", "penguin", "t-rex", "rubber ducky"
]

const spots = [
    'Go','Mediterranean Avenue','Community Chest','Baltic Avenue','Income Tax','Reading Railroad','Oriental Avenue','Chance','Vermont Avenue','Connecticut Avenue','Jail / Just Visiting','St. Charles Place','Electric Company','States Avenue','Virginia Avenue','Pennsylvania Railroad','St. James Place','Community Chest','Tennessee Avenue','New York Avenue','Free Parking','Kentucky Avenue','Chance','Indiana Avenue','Illinois Avenue','B. & O. Railroad','Atlantic Avenue','Ventnor Avenue','Water Works','Marvin Gardens','Go To Jail','Pacific Avenue','North Carolina Avenue','Community Chest','Pennsylvania Avenue','Short Line','Chance','Park Place','Luxury Tax','Boardwalk'
]

// spots that can not be bought

const nonproperties = [
    0,2,4,7,10,17,20,22,30,33,36,38
]

const spotPrices = [-1,60,-1,60,-1,200,100,-1,100,120,-1,140,150,140,160,200,180,-1,180,200,-1,220,-1,220,240,200,260,260,150,280,-1,300,300,-1,320,200,-1,350,-1,400]


const spotRents = [-1,2,-1,4,-1,50,6,-1,6,8,-1,10,-1,10,12,50,14,-1,14,16,-1,18,-1,18,20,50,22,22,-1,22,-1,26,26,-1,28,50,-1,35,-1,50];

const housePrices = []

const monopolies = [
    [1,3],
    [5,15,25,35],
    [6,8,9],
    [11,13,14],
    [16,18,19],
    [21,23,24],
    [26,27,29],
    [31,32,34],
    [37,39]
]

let hotelCount = 12
let houseCount = 32

const propColors = [
    'white','purple','white','purple','white','darkgray','lightblue','white','lightblue','lightblue','white','pink','gray','pink','pink','darkgray','orange','white','orange','orange','white','red','white','red','red','darkgray','yellow','yellow','gray','yellow','white','green','green','white','green','darkgray','white','blue','white','blue'
]

var pricePerHouse = [,50,,50,,,50,,50,50,,100,,100,100,,100,,100,100,,150,,150,150,,150,150,,150,,200,200,,200,,,200,,200];

var mono_1house = [,10,,20,,,30,,30,40,,50,,50,60,,70,,70,80,,90,,90,100,,110,110,,120,,130,130,,150,,,175,,200];

var mono_2house = [,30,,60,,,90,,90,100,,150,,150,180,,200,,200,220,,250,,250,300,,330,330,,360,,390,390,,450,,,500,,600];

var mono_3house = [,90,,180,,,270,,270,300,,450,,450,500,,550,,550,600,,700,,700,750,,800,800,,850,,900,900,,1000,,,1100,,1400];

var mono_4house = [,160,,320,,,400,,400,450,,625,,625,700,,750,,750,800,,875,,875,925,,975,975,,1025,,1100,1100,,1200,,,1300,,1700];

var mono_hotel = [,250,,450,,,550,,550,600,,750,,750,900,,950,,950,1000,,1050,,1050,1100,,1150,1150,,1200,,1275,1275,,1400,,,1500,,2000];

var chanceCards = ['','Advance to Boardwalk','Advance to Go (Collect $200)','Advance to Illinois Avenue. If you pass Go, collect $200','Advance to St. Charles Place. If you pass Go, collect $200','Advance to the nearest Railroad. If unowned, you may buy it from the Bank. If owned, pay wonder twice the rental to which they are otherwise entitled','Advance to the nearest Railroad. If unowned, you may buy it from the Bank. If owned, pay wonder twice the rental to which they are otherwise entitled','Bank pays you dividend of $50','Get Out of Jail Free','Go Back 3 Spaces','Go to Jail. Go directly to Jail, do not pass Go, do not collect $200','Make general repairs on all your property. For each house pay $25. For each hotel pay $100','Speeding fine $15','Take a trip to Reading Railroad. If you pass Go, collect $200','You have been elected Chairman of the Board. Pay each player $50','Your building loan matures. Collect $150'
];

function log(x) {
    logs.innerHTML += "</br>" + x
}

const playerObject = {
    name:undefined,
    cash:1500, // 1500
    owned:[],
    monopoles:[],
    currentSpot:0,
    inJail:false,
    getOutOfJailRolls:0,
    houses:[],
    hotels:[],

    init() {
        log(bold(this.name) + " has joined the game!")
        statRefresh()
    },

    move(r1,r2) {
        let newSpot = this.currentSpot+(r1+r2)

        if (newSpot >= spots.length) {
            newSpot = newSpot - spots.length
            log(bold(this.name)+ " passed Go and collected $200")
            this.cash += 200
        }

        log (bold(this.name) + " rolled: "+r1+" & "+r2)
        log(bold(this.name) + " moved "+(r1+r2)+" spaces from "+spots[this.currentSpot]+" to "+spots[newSpot])
        this.currentSpot = newSpot
        if (isProperty(this.currentSpot) == true) {
            canIBuy(this,1)
        } else {
            // nonproperties
            switch(this.currentSpot) {
                case 30:
                    this.currentSpot = 10 // JAIL SPOT
                    this.inJail = true
                    log(bold(this.name)+" was sent to the slammer!")
                    log("</br>")
                    statRefresh()
                    break;
                case 7:
                    chanceCard(this)
                    break;
                case 22:
                    chanceCard(this)
                    break;
                case 36:
                    chanceCard(this)
                    break;
                case 12:
                    utilitySpot(this, (r1+r2))
                    break;
                case 28:
                    utilitySpot(this, (r1+r2))
                    break;

            }
        }
        statRefresh()
    },

    jail() {
        this.currentSpot = 10 // JAIL SPOT
        this.inJail = true
        log(bold(this.name)+" has rolled their third set of doubles and went straight to jail! ")
        log("</br>")
        statRefresh()
    }, 

    purchase() {
        this.owned.push(this.currentSpot)
        this.cash -= spotPrices[this.currentSpot]
    }
}

function initalizeGame() {
    // player1 = Object.create(playerObject)
    // player1.name = availableNames[Math.floor(Math.random() * availableNames.length)]
    // availableNames.splice(availableNames.indexOf(player1.name), 1)
    // player1.owned = []
    // player1.houses = []
    // player1.hotels = []
    // player1.monopolies = []
    // player1.init()
    // players.push(player1)

    // player2 = Object.create(playerObject)
    // player2.name = availableNames[Math.floor(Math.random() * availableNames.length)]
    // availableNames.splice(availableNames.indexOf(player2.name), 1)
    // player2.owned = []
    // player2.houses = []
    // player2.hotels = []
    // player2.monopolies = []
    // player2.init()
    // players.push(player2)

    // if (playercount > 2) {
    //     player3 = Object.create(playerObject)
    //     player3.name = availableNames[Math.floor(Math.random() * availableNames.length)]
    //     availableNames.splice(availableNames.indexOf(player3.name), 1)
    //     player3.owned = []
    //     player3.houses = []
    //     player3.hotels = []
    //     player3.monopolies = []
    //     player3.init()
    //     players.push(player3)
    // }
    // if (playercount > 3) {
    //     player4 = Object.create(playerObject)
    //     player4.name = availableNames[Math.floor(Math.random() * availableNames.length)]
    //     availableNames.splice(availableNames.indexOf(player4.name), 1)
    //     player4.owned = []
    //     player4.houses = []
    //     player4.hotels = []
    //     player4.monopolies = []
    //     player4.init()
    //     log("<br/>")
    //     players.push(player4)
    // }

    for (let i=0;i<playercount;i++) {
        player = Object.create(playerObject)
        player.name = availableNames[Math.floor(Math.random() * availableNames.length)]
        availableNames.splice(availableNames.indexOf(player.name), 1)
        player.owned = []
        player.houses = []
        player.hotels = []
        player.monopolies = []
        player.init()
        players.push(player)
    }

    statRefresh()

    // x=0
    // while (x<20) {
    //     for (let i=0;i<players.length;i++) {
    //         roll(players[i])
    //     }
    //     x++
    // }
    
}

document.getElementById("nextTurn").onclick = function() {
    for (let i=0;i<players.length;i++) {
        roll(players[i])
    }
}

document.getElementById("nextTurn10").onclick = function() {
    x=0
    while (x<10) {
        for (let i=0;i<players.length;i++) {
            roll(players[i])
        }
        x++
    }
}

function roll(player) {
    if (!player.inJail) {
        upgradeProperties(player)
        let r1,r2
        let consec = 0
        let consecTimes = ["first", "second", "third"]
        while (r1 == r2) {
            r1 = Math.ceil(Math.random() * (6-1 + 1))
            r2 = Math.ceil(Math.random() * (6-1 + 1))
    
            if (r1 == r2) {
                log("<strong>"+player.name + "</strong> rolled doubles for the " +consecTimes[consec]+" time.")
                consec++
                if (consec >= 3) {
                    return player.jail()
                }
            } 
            if (consec < 3) {
                player.move(r1,r2)
            }
        }
        log("<br/>")
    } else {
        if (player.cash > 51 && (player.cash/player.owned.length) < 20 || (player.cash/player.owned.length) > 200) {
            player.cash -= 50
            log(bold(player.name)+ " paid to get out of jail. Rolling to move...")
            player.inJail = false
            roll(player)
        } else {
            r1 = Math.ceil(Math.random() * (6-1 + 1))
            r2 = Math.ceil(Math.random() * (6-1 + 1))
            log(bold(player.name) + " rolled a "+r1+" & "+r2+" in jail")
            player.getOutOfJailRolls++
            if (r1 == r2 || player.getOutOfJailRolls > 3) {
                log(bold(player.name) + " has busted out of jail. Rolling to move...")
                player.inJail = false
                player.getOutOfJailRolls = 0
                roll(player)
            } else {
                log(bold(player.name) + " is stuck in jail after rolling "+ r1+" & "+r2 +" ("+player.getOutOfJailRolls+"/3 tries)")

            }
        }
    }
    

}

function bold(x) {
    return "<strong>"+x+"</strong>"
}

function italic(x) {
    return "<span style='font-style:italic'>"+x+"</span>"
}

function statRefresh() {
    var t = document.createElement("table")
    stats.innerHTML = ""
    for (let i=0;i<players.length;i++) {
        updateMonopolies(players[i])
        var r = t.insertRow(0)
        var name = r.insertCell(0)
        name.innerText = players[i].name

        var cash = r.insertCell(1)
        cash.innerText = "$"+players[i].cash

        var spot = r.insertCell(2)
        spot.innerText = spots[players[i].currentSpot]

        var jail = r.insertCell(3)
        jail.innerText = "Jailed:"+players[i].inJail

        var prop = r.insertCell(4)
        for (let x=0;x<players[i].owned.length;x++) {
            let color = propColors[players[i].owned[x]]
            prop.innerHTML += "</br><span style='background-color:"+color+"'>"+spots[players[i].owned[x]]+"</span>"
        }



        var monopolies = r.insertCell(5)
        for (let x=0;x<players[i].monopolies.length;x++) {
            let color = propColors[players[i].monopolies[x]]
            if (monopolies.innerHTML.indexOf(color) == -1) {
                monopolies.innerHTML += color + "</br>"
            }
        
        }
        
        if (players[i].cash <= 0) {
            alert(players[i].name +" has run out of money.")
        }

        stats.append(t)
    }

}

function isProperty(x) {
    console.log("checking if "+spots[x]+" is a property")
    if (nonproperties.indexOf(x) == -1) {
        console.log("yes")
        return true
        
    } else {
        console.log("no")
        return false
    }
}

function updateMonopolies(x) {
    x.owned.sort((a,b) => a - b)
    for (let i=0;i<monopolies.length;i++) {
        if (monopolies[i].every(element => x.owned.indexOf(element) !== -1)) {
            for (let y=0;y<monopolies[i].length;y++) {
                x.monopolies.push(monopolies[i][y])
            }
            
        }
        
    }
    x.monopolies = uniq_fast(x.monopolies)
}



function canIBuy(x, multiplier) {
    let alreadyPurchased = false
    let purchasedBy
    for (let i=0;i<players.length;i++) {
        if (players[i].owned.indexOf(x.currentSpot) != -1) {
            alreadyPurchased = true
            purchasedBy = players[i]
            
        }
    }
    if (alreadyPurchased) {
        if (x == purchasedBy) {
            log(purchasedBy.name+" owns "+spots[x.currentSpot])
        } else {
            payRent(x, purchasedBy, x.currentSpot, multiplier)
        }
        
    } else if (x.cash > spotPrices[x.currentSpot]) {
        if (Math.floor(Math.random() * 9) + 1 <= 8) {
            // buy it 80% of the time if you have the cash
            log(bold(x.name) + " is buying "+spots[x.currentSpot] +" for $"+spotPrices[x.currentSpot])
            x.purchase()

        } else {
            log(bold(x.name) + " decided not to buy "+spots[x.currentSpot])
        }
    }
}

function payRent(payer, payee, spot, multiplier) {
    let rent = spotRents[spot]
    if (payee.monopolies.indexOf(spot) != -1) {
        rent = rent * 2
        log(bold(payer.name)+" will be paying double, as " +bold(payee.name)+" has the "+bold(propColors[spot])+" monopoly")
    }

    let housesOnSpot = 0
    if (spots[spot].indexOf('🏠') != -1) {
        housesOnSpot = spots[spot].split('🏠').length - 1
    }
    if (housesOnSpot == 1) {
        rent = mono_1house[spot]
    } else if (housesOnSpot == 2) {
        rent = mono_2house[spot]
    } else if (housesOnSpot == 3) {
        rent = mono_3house[spot]
    } else if (housesOnSpot == 4) {
        rent = mono_4house[spot]
    }

    log("Rent is... "+rent)

    if (payer.cash > rent*multiplier) {
        payer.cash -= rent*multiplier
        payee.cash += rent*multiplier
        log(bold(payer.name)+" paid " +bold(payee.name)+" $"+rent*multiplier+" for rent at "+spots[spot])
    } else {
        alert(payer+" has run out of money and lost. They could not afford to pay "+payer.name+" $"+rent)
    }
}

function chanceCard(player) {
    let r = Math.floor(Math.random() * (15 - 1) ) + 1;
    console.log(r)
    log(italic(chanceCards[r]))
    //log(r)

    switch(r) {
        case 1:
            player.currentSpot = 39
            canIBuy(player,1)
            break;
        case 2:
            player.currentSpot = 0
            player.cash += 200
            break;
        case 3:
            if (player.currentSpot > 24) {
                player.cash += 200
            }
            player.currentSpot = 24
            break;
        case 4:
            if (player.currentSpot > 11) {
                player.cash += 200
            }
            player.currentSpot = 11
            break;
        case 5:
            if (player.currentSpot >= 0 && player.currentSpot <=5 ) {
                player.currentSpot = 5
            }
            if (player.currentSpot >= 6 && player.currentSpot <=15 ) {
                player.currentSpot = 15
            }
            if (player.currentSpot >= 16 && player.currentSpot <=25 ) {
                player.currentSpot = 25
            }
            if (player.currentSpot >= 26 && player.currentSpot <=35 ) {
                player.currentSpot = 35
            } else {
                player.currentSpot = 5
            }

            canIBuy(player,2)
            break;
        case 6:
            if (player.currentSpot >= 0 && player.currentSpot <=5 ) {
                player.currentSpot = 5
            }
            if (player.currentSpot >= 6 && player.currentSpot <=15 ) {
                player.currentSpot = 15
            }
            if (player.currentSpot >= 16 && player.currentSpot <=25 ) {
                player.currentSpot = 25
            }
            if (player.currentSpot >= 26 && player.currentSpot <=35 ) {
                player.currentSpot = 35
            } else {
                player.currentSpot = 5
            }

            canIBuy(player,2)
            break;
        case 7:
            player.cash += 50
            break;
        case 8:
            player.getOutOfJailForFreeCards++
            break;
        case 9:
            player.currentSpot -= 3
            canIBuy(player,1)
            break;
        case 10:
            this.currentSpot = 10 // JAIL SPOT
            this.inJail = true
            log("</br>")
            break;
        case 11:
            //TODO
            break;
        case 12:
            player.cash -= 15
            break;
        case 13: 
            player.currentSpot = 5
            canIBuy(player,1)
            break;
        case 14:
            player.cash -= 250
            for (let i=0;i<players.length;i++) {
                players[i].cash += 50
            }
            break;
        case 15:
            player.cash += 150
            break;

    }
    statRefresh()
}

function uniq_fast(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}

function upgradeProperties(player) {
    // this is called when a players turn is up, and they have at least one monopoly
    
    var sets = [] // monopolies in like pairs, i.e. [[1,3], [37,39]]

    for (let m=0;m<player.monopolies.length;m++) {
        let housesToBuy = 0
        let hotelsToBuy = 0
        housesToBuy = Math.floor((player.cash/player.monopolies.length) / pricePerHouse[player.monopolies[m]])

        while (housesToBuy > 4) {
            hotelsToBuy++
            housesToBuy -= 5 // cost of all houses + 1 hotel
        }

        let housesOnSpot = 0
        if (spots[player.monopolies[m]].indexOf('🏠') != -1) {
            housesOnSpot = spots[player.monopolies[m]].split('🏠').length - 1
        }
        
        let hotelsOnSpot = 0
        if (spots[player.monopolies[m]].indexOf('🏨') != -1) {
            hotelsOnSpot = spots[player.monopolies[m]].split('🏨').length - 1
        }
        
        if (housesOnSpot >= 4) {housesToBuy = 0}
        if (hotelsOnSpot >= 1) {hotelsToBuy = 0}

        if (housesToBuy + housesOnSpot > 4) {housesToBuy = 4 - housesOnSpot}
        if (hotelsToBuy + hotelsOnSpot > 1) {hotelsToBuy = 1 - hotelsOnSpot}

        while(hotelsToBuy > 0 && hotelCount > 0 && player.cash > 0) {
            if (hotelCount >= hotelsToBuy) {
                // buy the hotels
                player.hotels.push(player.monopolies[m])
                player.cash -= (5*pricePerHouse[player.monopolies[m]])
                spots[player.monopolies[m]] += "🏨"
                hotelsToBuy -= 1
                log(bold(player.name) +" has bought 1 hotel on "+spots[player.monopolies[m]])
            } else {
                hotelsToBuy = 0
            }
        }

        while(housesToBuy > 0 && houseCount > 0 && player.cash > 0) {
            if (houseCount >= housesToBuy) {
                // buy the houses
                player.houses.push(player.monopolies[m])
                player.cash -= pricePerHouse[player.monopolies[m]]
                housesToBuy -= 1
                spots[player.monopolies[m]] += "🏠"
                log(bold(player.name) +" has bought 1 house on "+spots[player.monopolies[m]])
            } else {
                housesToBuy = 0
            }
        }



        
    }
    statRefresh()
}

function utilitySpot(player, roll) {
    let alreadyPurchased = false
    let purchasedBy
    for (let i=0;i<players.length;i++) {
        if (players[i].owned.indexOf(player.currentSpot) != -1) {
            alreadyPurchased = true
            purchasedBy = players[i]
            
        }
    }
    if (alreadyPurchased) {
        let double = false
        let owner
        for (let i=0;i<players.length;i++) {
            if (players[i].owned.indexOf(12) != -1 && players[i].owned.indexOf(28) != -1) {
                double = true
            }
        }
        rent = roll * 10
    
        if (double) {
            log(bold(purchasedBy) + " owns both utilities, so the rent will be double.")
            rent = rent * 2
        }
        
        log("Rent is... "+rent)
        player.cash -= rent
        purchasedBy.cash += rent
        log(bold(payer.name)+" paid " +bold(payee.name)+" $"+rent+" for rent at "+spots[spot])
        
    } else {
        canIBuy(player,1)
    }
    

}

initalizeGame()


