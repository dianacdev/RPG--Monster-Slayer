let xp = 0
let health = 100
let gold = 20
let currentWeapon = 0
let fighting
let monsterHealth
let inventory = ["stick"]

const button1 = document.querySelector("#button1") //Go to store Button
const button2 = document.querySelector("#button2") //Go to cave button
const button3 = document.querySelector("#button3") //Fight dragon button
const text = document.querySelector('#text')
const xpText = document.querySelector('#xpText')
const healthText = document.querySelector('#healthText')
const goldText = document.querySelector('#goldText')
const monsterStats = document.querySelector('#monsterStats')
const monsterNameText = document.querySelector('#monsterName')
const monsterHealthText = document.querySelector('#monsterHealth')

const weapons = [
    {
        name:"stick",
        power:50
    },
    {
        name:"dagger",
        power:50    
    },
    {
        name:"claw hammer",
        power:60
    },
    {
        name:"sword",
        power:100
    }
];

const monsters = [
    {
        name:"Slime",
        level: 2,
        health: 15
    },
    {
        name:"Fanged Beast",
        level: 8,
        health: 60
    },
    {
        name:"Dragon",
        level: 20,
        health: 300
    }
]

const locations = [
    {
        name: "town square",
        "button text": ["Go to store","Go to cave", "Fight dragon"],
        "button functions": [goStore, goCave, fightDragon],
        text: "You are in the town square. You see a sign that says \"Store\"."
    },
    {
        name: "store",
        "button text": ["Buy 10 health (10g)","Buy weapon (30g)", "Go to town square"],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "You enter the store."
    },
    {
        name: "cave",
        "button text": ["Fight slime","Fight fanged beast", "Go to town square"],
        "button functions": [fightSlime, fightBeast, goTown],
        text: "You enter the cave. You see some monsters."
    },
    {
        name: "fight",
        "button text": ["Attack","Dodge", "Run"],
        "button functions": [attack, dodge, goTown],
        text: "You are fighting a monster."
    },
    {
        name: "kill monster",
        "button text": ["Go to town square","Go to town square", "Go to town square"],
        "button functions": [goTown, goTown, easterEgg],
        text: "The monster screams \"ARGRAHG!\" as it dies. You gain experience points and find gold."
    },
    {
        name: "lose",
        "button text": ["Replay?","Replay?", "Replay?"],
        "button functions": [restart, restart, restart],
        text: "💀 You were slaughtered 💀"
    },
    {
        name: "win",
        "button text": ["Replay?","Replay?", "Replay?"],
        "button functions": [restart, restart, restart],
        text: "🎉🔥 You defeated the dragon! YOU WIN! 🔥🎉"
    },
    {
        name: "easterEgg",
        "button text": ["2","8", "Go to town square?"],
        "button functions": [pickTwo, pickEight, goTown],
        text: "You find a merchant with an offer. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
    },
    {
        name: "dragon trigger",
        "button text": ["Attack","Dodge", "Run"],
        "button functions": [attack, dodge, tossGold],
        text: "The dragon, found you had a hoard of gold. He plans to do anything to obtain your riches."
    },
]

// Initialize Buttons
button1.onclick = goStore
button2.onclick = goCave
button3.onclick = fightDragon

//Initialize Stats
healthText.innerText = health
goldText.innerText = gold

function update(location){
    monsterStats.style.display = "none" //removing the monster stats
    button1.innerText = location["button text"][0]
    button2.innerText = location["button text"][1]
    button3.innerText = location["button text"][2]
    button1.onclick = location["button functions"][0]
    button2.onclick = location["button functions"][1]
    button3.onclick = location["button functions"][2]
    text.innerText = location.text
}

function goTown(){
    if (gold >= 120){
        fighting = 2
        update(locations[8])
        monsterHealth = monsters[fighting].health
        monsterStats.style.display = "block"
        monsterNameText.innerText = monsters[fighting].name
        monsterHealthText.innerText = monsterHealth;
    }
    else{
        update(locations[0])
    }
}

function goStore(){
    update(locations[1])
}

function goCave(){
    update(locations[2])
}

function buyHealth(){
    if (gold >= 10){
        health += 10
        gold -=10
        healthText.innerText = health
        goldText.innerText = gold
    }
    else{
        text.innerText = "Insufficient Funds."
    }
}
function buyWeapon(){
    if(currentWeapon < weapons.length - 1 ){
        if (gold >= 30){
            gold -= 30
            currentWeapon += 1
            goldText.innerText = gold
            let newWeapon = weapons[currentWeapon].name
            text.innerText = "You know have a " + newWeapon + "."
            inventory.push(newWeapon)
            text.innerText += "In your inventory you have: " + inventory
        }
        else{
            text.innerText = "Insufficient Funds."
        }
    }
    else{
        text.innerText = "You have purchased all the weapons."
        button2.innerText = "Sell weapon for 15 gold"
        button2.onclick = sellWeapon
    }
}
function sellWeapon(){
    if (inventory.length > 1){
        gold+=15
        goldText.innerText = gold
        let currentWeapon = inventory.shift()
        text.innerText = "You sold a " + currentWeapon + "."
        text.innerText +=" In your inventory you have: " + inventory
    }
    else{
        text.innerText = "Don't sell your only weapon!"
    }
}

function fightDragon(){
    fighting = 2
    goFight()
}
function fightSlime(){
    fighting = 0
    goFight()
}
function fightBeast(){
    fighting = 1
    goFight()
}

function goFight(){
    update(locations[3])
    monsterHealth = monsters[fighting].health
    monsterStats.style.display = "block"
    monsterNameText.innerText = monsters[fighting].name
    monsterHealthText.innerText = monsterHealth;
}
function attack(){
    text.innerText = "The " + monsters[fighting].name + " attacks."
    text.innerHTML += "You attack with your " + weapons[currentWeapon].name + "."

    if(isMonsterHit()){
        health -= getMonsterAttackValue(monsters[fighting].level) //changing the users health
    }else{
        text.innerText += " You miss."
    }

    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1 //getting damage on monster
    healthText.innerText = health
    monsterHealthText.innerText = monsterHealth
    if (health <= 0){
        lose()
    }else if(monsterHealth <= 0){
        fighting === 2 ? winGame() : defeatMonster() //ternary operation 
    }

    if (Math.random() <= .1 && inventory.length !== 1){
        text.innerText += "Your " +inventory.pop()+" broke"
        currentWeapon--
    }
}
function dodge(){
    text.innerText = "You dodge the attack from the " + monsters[fighting].name + "."
}
function defeatMonster(){
    gold += Math.floor(monsters[fighting].level * 6.7) //rewarding the player with gold
    goldText.innerText = gold
    xp += monsters[fighting].level;
    xpText.innerText = xp
    update(locations[4])
}
function lose(){
    update(locations[5])
}
function restart(){
    xp = 0
    gold = 100
    health = 100
    currentWeapon = 0
    inventory = ["stick"]
    xpText.innerText = xp
    goldText.innerText = gold
    healthText.innerText = health
    goTown()
}
function winGame(){
    update(locations[6])
}
function getMonsterAttackValue(level){
    let hit = (level * 5) - (Math.floor(Math.random()*xp))
    return hit
}

function isMonsterHit(){
    return Math.random() > .2 || health < 20
}
function easterEgg(){
    update(locations[7])
}
function pickTwo(){
    pick(2)
}
function pickEight(){
    pick(8)
}
function pick(guess){
    let numbers = []
    while (numbers.length < 10){
        numbers.push(Math.floor(Math.random() * 11)) //getting a random number between 1 and 10 
    }
    text.innerText = "You picked " + guess + ". Here are the random numbers:\n"

    for (let i = 0; i<10; i++){  //loops while i is less than 10
        text.innerText += numbers[i] +","
    }
    if(numbers.indexOf(guess) !== -1){
        text.innerText += "\nYou won 20 Gold!"
        gold += 20
        goldText.innerText = gold
    }
    else{
        text.innerText += "\nYou lost! The merchant has stolen 10 gold from you! The merchant also mentally drained you, lose 10 health."
        gold -= 10
        health -=10
        goldText.innerText = gold
        healthText.innerText = health
        if (health <= 0){
            lose()
        }
    }
}
function tossGold(){
    gold = 0
    goldText.innerText = gold
    text.innerText += "\n You Evaded the dragon but lost all your gold." 
    goTown()
}