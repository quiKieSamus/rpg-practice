class Character { /*
    Character class: The character class contains everything that concerns about each specific character in the combat system. These could be the player or the enemy computer. 

    As in any rpg game, each character has a set of stats that will take effect once combat begins. These stats are:

        1.- ID: an identifier for each character (As of now, there is no use for this stat but it might come handy in the future).
        2.- Name: Name of the character that will be displayed.
        3.- hp: Health Points. Once they reach a value of 0 or less, character faints.
        4.- atk: Attack Points. The sheer force of the character, higher means heavier, more powerful attacks. It is decreased by enemy defense points (def)
        5.- def: Defence Points. The resilience of the character, higher means the character can withstand more hits while taking less damage. 
        6.- sp: Speed Points. The character's agility. The one character that has the higher speed will act first.
    
    Now, there are some extra stats which end with the word origin, these stats don't actually interact in combat but serve the purpose of restoring to origin, when battle is over, any stat that was changed during combat be it by a move that could decrease defence or attack (these are just examples to explain the concept in discussion) or anything else that could change a character stat.

    When it comes to the methods that the character class has, we can talk about a few that might be self explanatory:
        1.- Attack method: receives the parameter of target. This method attacks a target character instance (an enemy) while in combat.
        2.- Defend method: Increases the character defence for the next turn by 100%. Good when expecting high damage output.
        3.- Heal method: Heals a charater by 30 points.
    
    The resetStatsToOrigin Method which is not completed should serve the purpose of setting each stats to its origin status (These was discussed previously in this comment).

    To add:

        1.- Mana or Energy Stats that avoids the overuse (spam) of special techniques such as the heal method.

*/
    constructor(id, name, hp, atk, def, mana, sp, isPlayer) {
        this.id = id;
        this.name = name;
        this.hp = hp;
        this.hpOrigin = this.hp;
        this.atk = atk;
        this.atkOrigin = this.atk;
        this.def = def;
        this.defOrigin = this.def;
        this.mana = mana;
        this.manaOrigin = this.mana;
        this.sp = sp;
        this.spOrigin = this.sp;
        this.isPlayer = isPlayer;
    }

    attack(target) {
        const gamble = Math.random();
        const damage = Math.round((this.atk + (this.atk * Math.random()))) - target.def;
        let damageDone;
        if (gamble > 0.9) {
            const critHit = damage * 3;
            damageDone = target.hp - critHit;
            target.hp = damageDone;
            if (target.hp <= 0) {
                target.hp = 0;
            }
            Display.updateCombatLog(`IT WAS A CRITICAL HIT <span class="name">${this.name}</span>!!!! <span class="dmg">${critHit}</span> points of damage were dealt`);
            Display.attack(true);
            Display.updateBattleInfo(critHit, 'dmg');
            return critHit;
        }
        damageDone = target.hp - damage;
        target.hp = damageDone;
        if (target.hp <= 0) {
            target.hp = 0;
        }
        Display.attack();
        Display.updateCombatLog(`<span class="name">${this.name}</span> attacks <span class="name">${target.name}</span> dealing <span class="dmg">${damage}</span> points of damage`);
        Display.updateBattleInfo(damage, 'dmg');
        return damage;
    }

    defend() {
        this.def = this.def * 2;
        Display.updateCombatLog(`<br>With the power of the gods, you gather resilience to <br> withstand your mighty foe's attack. <br>Defence increased by 100% for the following <br> opponent's attack`);
        return this.def;
    }

    //heal character, healed param is the one receiving the healing
    heal() {
        if (this.mana < 30) {
            if (this.name === "Abby") {
                this.say(`I don't have enough <span class="mana">MP</span>, I have no choice but to attack you <span class="name">${ch2.name}</span>`);
                this.attack(ch2);
                return ch2.hp;
            }
            Display.updateCombatLog(`<span class="name">${this.name}</span>, you don't have enough <span class="mana">MP</span> for that move`);
        } else {
            let heal = 30;
            if (this.hp === this.hpOrigin) {
                Display.updateCombatLog(`<span class="name">${this.name}</span>, your HP is at max`);
                return this.hp;
            }
            if (this.hp + heal > this.hpOrigin) {
                Display.updateCombatLog(`<span class="name">${this.name}</span> Healed for <span class="heal">${heal}</span> points`);
                this.hp = this.hpOrigin;
                this.mana -= 30;
                Display.heal();
                Display.updateBattleInfo(heal, 'heal');
                return this.hp
            }
            this.hp += heal;
            this.mana -= 30;
            Display.updateCombatLog(`<span class="name">${this.name}</span> Healed for <span class="heal">${heal}</span> points`);  
            Display.heal();
            Display.updateBattleInfo(heal, 'heal');
        }

        return this.hp;
    }

    resetOneTurnEffectStatsToOrigin() {
        this.def = this.defOrigin;
    }

    resetStatsToOrigin() {
        this.hp = ch.hpOrigin;
        return ch.hp;
    }

    say(toSay) {
        Display.updateCombatLog(`<span class="name">${this.name}</span>: ${toSay}`);
    }
}

class CombatSystem {
    /*
    The CombatSystem Class has control over what happens in the battle, who can make a move and who can't. It's kind of like the referee who checks that everything is going fine for the participants involved in the combat. It isn't perfect but it's functional. It knows when someone wins or loses, has data on the amount of turns that has passed and when the combat is over. Each combat that could occur in the game will create a new CombatSystem instance. Each instance has a p1 (participant 1) and a p2 (participant 2).
    */
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.turns = 0;
        this.p1Move = true;
        this.p2Move = true;
        this.status; //0 is combat finished, 1 is combat in progress
        this.oneTurnEffects = false; 
    }

    getTurns() {
        return this.turns;
    }

    increaseTurn() {
        this.turns++;
        if (this.turns > 1) {
            Display.updateCombatLog(`<br>Turn(s): <span class="turns">${this.turns}</span><hr>`);
        } else {
            Display.updateCombatLog(`Turn(s): <span class="turns">${this.turns}</span><hr>`);

        }
        return this.turns;
    }

    beginCombat() {
        this.status = 1;
        this.increaseTurn();
        Display.updateCombatLog("Combat has begun. Read instructions below (Scroll down)");
        return this.status;
    }

    //method to make a turn
    doTurn(atkr, dfndr, op) {
        this.winChek();
        if (this.status === 1) {
            switch (op) {
                case 'atk':
                    atkr.attack(dfndr);
                    break;
                case 'heal':
                    atkr.heal();
                    break;
                case 'def':
                    atkr.defend();
                    this.oneTurnEffects = true
                    break;
            }
            if (atkr.name === 'Ybba') {
                this.p2Move = false;
            } else {
                this.p1Move = false;
            }

            if (this.p2Move === false && this.p1Move === false) {
                this.increaseTurn();
                this.p2Move = true;
                this.p1Move = true;
                if (this.oneTurnEffects === true) {
                    this.oneTurnEffectsReset();
                }
                
            }
            Display.updateCombatStats();

        } else {
            Display.updateCombatLog("Combat is over");
            Display.hideControls(true);
        }
        this.winChek();
        Display.logScrolltoBottom();
    }

    winChek() {
        if (this.p1.hp <= 0) {
            Display.hideControls(true);
            Display.updateCombatLog(`Winner is ${this.p2.name}`);
            Display.win();
            Sound.playVictoryMusic();
            this.status = 0;
        }
        if (this.p2.hp <= 0) {
            Display.hideControls(true);
            Display.updateCombatLog(`Winner is ${this.p1.name}`);
            Sound.playGameOverMusic();
            Display.updateCombatLog(`Game Over`);
            this.status = 0;
        }
    }
    //method to set player's move to  finished (false)
    playerMoveDone() {
        this.p2Move = false;
        return this.p2Move;
    }

    cpuMove() {
        let op = "atk"
        let gamble = Math.round(Math.random());
        if (this.p1.hp < this.p1.hpOrigin * 0.5) {
            if (gamble === 0) {
                op = "heal";
            }
        }
        this.doTurn(ch1, ch2, op);
        // this.p1Move = false;
        return this.p1Move;
    }

    oneTurnEffectsReset() {
        ch1.def = ch1.defOrigin;
        ch2.def = ch2.defOrigin;
        Display.updateCombatLog("All one turn effects buffed stats have been restored to origin status");
        this.oneTurnEffects = false;

    }

}

class Display {

    static updateCombatStats() {
        for (let i = 0; i < document.querySelectorAll(".ch").length; i++) {
            const charContainers = document.querySelectorAll(".ch");
            charContainers[i].children[1].innerHTML = `${i === 0 ? ch1.name : ch2.name + " (you)"}`;
            charContainers[i].children[2].innerHTML = `${i === 0 ? ch1.hp : ch2.hp}/${i === 0 ? ch1.hpOrigin : ch2.hpOrigin}HP`;
            charContainers[i].children[3].innerHTML = `${i === 0 ? ch1.mana : ch2.mana}/${i === 0 ? ch1.manaOrigin : ch2.manaOrigin}MP`;
        }
        this.combatHealthColors(ch1);
        this.combatHealthColors(ch2);
    }

    static updateBattleInfo(info, type) {
        const battleInfo = document.querySelector(".battle-info");
        switch (type) {
            case 'dmg':
                battleInfo.style.color = "red";
                battleInfo.innerHTML = `<h1>-${info}</h1>`;
                setTimeout(() => {
                    battleInfo.innerHTML = "<br>";
                }, 1000);
                break;
            case 'heal':
                battleInfo.style.color = "green";
                battleInfo.innerHTML = `<h1>+${info}</h1>`;
                setTimeout(() => {
                    battleInfo.innerHTML = "<br>";
                }, 1000);
                break;

        }
    }

    static combatHealthColors(ch) {
        const hp = document.querySelectorAll(".hp");
        for (let i = 0; i < hp.length; i++) {
            if (ch.hp <= ch.hpOrigin * 0.5) {
                if (ch.name !== "Ybba") {
                    // ch.say("Really good of you to make me sweat, although this act of yours is going to end really soon");
                    hp[0].style.color = "yellow";
                } else {
                    hp[1].style.color = "yellow";
                }
            } else {
                if (ch.name !== "Ybba") {
                    hp[0].style.color = "green";
                } else {
                    hp[1].style.color = "green";
                }
            }
            if (ch.hp <= ch.hpOrigin * 0.25) {
                if (ch.name !== "Ybba") {
                    // ch.say("Tch! No one has pushed me this far in a long while");
                    hp[0].style.color = "red";
                } else {
                    hp[1].style.color = "red";
                }
            }
        }
        return ch.hp;
    }

    static updateCombatLog(log) {
        const combatLog = document.querySelector(".combat-log");
        if (log === "") {
            combatLog.innerHTML = log;
        } else {
            combatLog.innerHTML += `<br>${log}`;
        }
        
    }

    static attack(isCrit) {
        const background = document.querySelector("body");
        if (isCrit === true) {
            background.style.backgroundColor = "yellow";
            setTimeout(() => {
                background.style.backgroundColor = "white";
            }, 1000);
        } else {
            background.style.backgroundColor = "red";
            setTimeout(() => {
                background.style.backgroundColor = "white";
            }, 1000);
        }
    }

    static heal() {
        const background = document.querySelector("body");
        background.style.backgroundColor = "green";
        setTimeout(() => {
            background.style.backgroundColor = "white";
        }, 1000);
    }

    static win() {
        const background = document.querySelector("body");
        background.style.backgroundColor = "blue";
    }

    static gameOver() {
        const background = document.querySelector("body");
        background.style.backgroundColor = "red";
    }

    static hideControls(allControls) {
        if (allControls === true) {
            document.querySelector("#btn-next").style.display = "none";
        }
        const controlsToHide = document.querySelectorAll(".hide-after-player-turn");
        for (let i = 0; i < controlsToHide.length; i++) {
            controlsToHide[i].style.display = "none";
        }
    }

    static showControls() {
        const controlsToHide = document.querySelectorAll(".hide-after-player-turn");
        for (let i = 0; i < controlsToHide.length; i++) {
            controlsToHide[i].style.display = "inline";
        }
    }

    static logScrolltoBottom() {
        const combatLog = document.querySelector(".combat-log");
        combatLog.scrollTop = combatLog.scrollHeight;
    }

    static playerStats() {
        // const statsContainer = document.querySelector(".stats").children;
        // for (let i = 0; i < statsContainer.length; i++) {
        //     statsContainer[0].innerHTML = `HP: ${ch2.hpOrigin}`
        //     statsContainer[1].innerHTML = `Attack: ${ch2.atkOrigin}`;
        //     statsContainer[2].innerHTML = `Defence: ${ch2.defOrigin}`;
        //     statsContainer[3].innerHTML = `Mana: ${ch2.manaOrigin}`;
        //     statsContainer[4].innerHTML = `Speed: ${ch2.spOrigin}`;
        // }
        this.updateCombatLog(`Name: ${ch2.name}, the maidenless<br>HP: ${ch2.hpOrigin}<br>Attack: ${ch2.atkOrigin}<br>Defence: ${ch2.defOrigin}<br>Mana: ${ch2.manaOrigin}<br>Speed: ${ch2.spOrigin}`);
        this.logScrolltoBottom();
    }

}

class Sound {

    static getAudio() {
        return document.querySelector(".audio");
    }

    static getAudioSource() {
        return document.querySelector(".source-audio");
    }

    static prepareAudio() {
        this.loadSound();
        this.playSound();
        this.getAudio().loop = "true";
    }

    static loadSound() {
        this.getAudio().load();
    }
    static playSound() {
        this.getAudio().play();
    }

    static stopSound() {
        this.getAudio().pause();
    }

    static playBattleMusic() {
        this.getAudioSource().src = "./resources/audio/au_fight.mp3";
        this.prepareAudio()
    }

    static playVictoryMusic() {
        this.getAudioSource().src = "./resources/audio/au_win.mp3";
        this.prepareAudio()
    }

    static playGameOverMusic() {
        this.getAudioSource().src = "./resources/audio/au_gameOver.mp3";
        this.prepareAudio()
    }
}
Display.updateCombatLog("");
const ch1 = new Character(0, "Abby", 30, 5, 3, 100, 10, false);
const ch2 = new Character(1, "Ybba", 35, 6, 2, 70, 5, true);
document.querySelector(".combat-log").style.display = "none"
const combat = new CombatSystem(ch1, ch2);

const btnBegin = document.getElementById("btn-begin");
btnBegin.addEventListener("click", () => {
    const containerChar = document.querySelector(".char-containers");
    const containerControls = document.querySelector(".controls");
    const beginDiv = document.querySelector(".begin");
    const guide = document.querySelectorAll(".guide");
    guide[0].style.display = "block";
    guide[1].style.display = "block";
    beginDiv.style.display = "none";
    containerChar.style.display = "block";
    containerControls.style.display = "block";
    document.querySelector(".combat-log").style.display = "block"
    btnBegin.style.display = "none";
    Display.updateCombatStats();
    Sound.playBattleMusic();
    combat.beginCombat();
});

const btnAttack = document.getElementById("btn-attack");
btnAttack.addEventListener("click", () => {
    const op = "atk";
    combat.doTurn(ch2, ch1, op);
    // combat.playerMoveDone();
    Display.hideControls();
});

const btnHeal = document.getElementById("btn-heal");
btnHeal.addEventListener("click", () => {
    const op = "heal";
    // combat.playerMoveDone();
    combat.doTurn(ch2, ch1, op);
    Display.hideControls();
})

const btnDefend = document.getElementById("btn-defend");
btnDefend.addEventListener("click", () => {
    const op = "def";
    combat.doTurn(ch2, ch1, op);
    Display.hideControls();

});

const btnStats = document.getElementById("btn-stats");
btnStats.addEventListener("click", () => {
    Display.playerStats();
});

const btnNext = document.getElementById("btn-next");
btnNext.addEventListener("click", () => {
    combat.cpuMove();
    Display.showControls();
});
