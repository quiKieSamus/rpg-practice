class Character {
    constructor(id, name, hp, atk, def, sp, sprite) {
        this.id = id;
        this.name = name;
        this.hp = hp;
        this.hpOrigin = this.hp;
        this.atk = atk;
        this.atkOrigin = this.atk;
        this.def = def;
        this.defOrigin = this.def;
        this.sp = sp;
        this.spOrigin = this.sp;
        this.sprite = sprite;
    }

    attack(target) {
        const gamble = Math.random();
        const damage = Math.round((this.atk + (this.atk * Math.random()))) - target.def;
        let damageDone;
        if (gamble > 0.7) {
            const critHit = damage * 3;
            damageDone = target.hp - critHit;
            target.hp = damageDone;
            Display.updateCombatLog(`IT WAS A CRITICAL HIT ${this.name}!!!! ${critHit} points of damage were dealt`);
            Display.attack(true);    
            return critHit;
        }
        damageDone = target.hp - damage;
        target.hp = damageDone;
        Display.attack();
        Display.updateCombatLog(`${this.name} attacks ${target.name} dealing ${damage} points of damage`);
        return damage;
    }

    defend() {
        this.def = this.def + (this.def * 0.5);
        return this.def;
    }

    //heal character, healed param is the one receiving the healing
    heal() {
        let heal = 30;
        this.hp += heal;
        Display.heal();
        Display.updateCombatLog(`${this.name} Healed for ${heal} points`);
        return this.hp;
    }

    resetStatsToOrigin(ch = this) {
        ch.hp = ch.hpOrigin;
        return ch.hp;
    }
}

class CombatSystem {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.turns = 0;
        this.p1Move = true;
        this.p2Move = true;
        this.status; //0 is combat finished, 1 is combat in progress
    }

    getTurns() {
        return this.turns;
    }

    increaseTurn() {
        this.turns++;
        Display.updateCombatLog(`Turn(s): ${this.turns}`);
        return this.turns;
    }

    beginCombat() {
        this.status = 1;
        this.increaseTurn();
        Display.updateCombatLog("combat has begun");
    }
    //method to make a turn
    doTurn(atkr, dfndr, op) {
        this.winChek();
        if (this.status === 1) {
            if (this.p1Move === false && this.p2Move === false) {
                this.increaseTurn();
                this.p1Move = true;
                this.p2Move = true;
                return [this.p1Move, this.p2Move];
            } else {
                switch (op) {
                    case 'atk':
                        atkr.attack(dfndr);
                        break;
                    case 'heal':
                        atkr.heal();
                        break;
                }

                Display.updateCombatStats();

            }
        } else {
            Display.updateCombatLog("Combat is over");
            Display.hideControls(true);
        }
        this.winChek();
        Display.logScrolltoBottom();
    }

    winChek() {
        if (this.p1.hp <= 0) {
            Display.updateCombatLog(`Winner is ${this.p2.name}`);
            Display.win();
            Sound.playVictoryMusic();
            this.status = 0;
        }
        if (this.p2.hp <= 0) {
            Display.updateCombatLog(`Winner is ${this.p1.name}`);
            Sound.playGameOverMusic();
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

}

class Display {
    static updateCombatStats() {
        for (let i = 0; i < document.querySelectorAll(".ch").length; i++) {
            const charContainers = document.querySelectorAll(".ch");
            charContainers[i].children[1].innerHTML = `${i === 0 ? ch1.name : ch2.name}`;
            charContainers[i].children[2].innerHTML = `${i === 0 ? ch1.hp : ch2.hp}/${i === 0 ? ch1.hpOrigin : ch2.hpOrigin}HP`;
        }
    }

    static updateCombatLog(log) {
        const combatLog = document.querySelector(".combat-log");
        combatLog.value += log + "\n";
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

}

class Sound {

    static getAudio() {
        return document.querySelector(".audio");
    }

    static getAudioSource() {
        return document.querySelector(".source-audio");
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
        this.loadSound();
        this.playSound();
        this.getAudio().loop = "true";
    }

    static playVictoryMusic() {
        this.getAudioSource().src = "./resources/audio/au_win.mp3";
        this.loadSound();
        this.playSound();
        this.getAudio().loop = "true";
    }

    static playGameOverMusic() {
        this.getAudioSource().src = "./resources/audio/au_gameOver.mp3";
        this.loadSound();
        this.playSound();
        this.getAudio().loop = "true";
    }
}

const ch1 = new Character(0, "Abby", 30, 5, 3, 10);
const ch2 = new Character(1, "Ybba", 35, 6, 2, 5);
document.querySelector(".combat-log").style.display = "none"
const combat = new CombatSystem(ch1, ch2);

const btnBegin = document.getElementById("btn-begin");
btnBegin.addEventListener("click", () => {
    const containerChar = document.querySelector(".char-containers");
    const containerControls = document.querySelector(".controls");

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

const btnNext = document.getElementById("btn-next");
btnNext.addEventListener("click", () => {
    combat.cpuMove();
    Display.showControls();
});
