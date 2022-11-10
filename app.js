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

    //heal character, healed param is the one receiving the healing
    heal(ch = this) {
        const currentHealth = this.hp;
        if (this.hp + 30 >= this.hpOrigin) {
            if (this.hp === this.hpOrigin) {
                Display.updateCombatLog("Your hp is at its top");
            }
            const hpHealed = this.hp + 30 - currentHealth;     
            this.hp = this.hp + 30 - currentHealth;
            Display.updateCombatLog(`${this.name} heals for ${hpHealed} points`);
        } else {
            this.hp += 30;
        }
        
        return this.hp;
    }

    resetStatsToOrigin(ch = this) {
        ch.hp = ch.hpOrigin;
        return ch.hp;
    }
}

class CombatSystem {
    constructor(atkr, dfndr) {
        this.atkr = atkr;
        this.dfndr = dfndr;
        this.turns = 0;
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
    doTurn(atkr = this.atkr, dfndr = this.dfndr) {
        if (this.turns === 0) {
            this.beginCombat();
        } else {
            const win = this.winCheck();
            if (win === true) {
                Display.updateCombatLog("battle is over");
                return dfndr.hp;
            } else {
                const damage = atkr.atk;
                const hpTaken = dfndr.hp - damage;
                dfndr.hp = hpTaken;
                Display.attack();
                this.winCheck();
            }
            this.increaseTurn();
        }
        Display.updateCombatStats();
        return dfndr.hp;
    }

    //method to check if battle is over
    winCheck(atkr = this.atkr, dfndr = this.dfndr) {
        let win = false;
        if (dfndr.hp <= 0) {
            win = true;
            Display.updateCombatLog("winner is: " + atkr.name);
            this.status = 0;
        } else if (atkr.hp <= 0) {
            Display.updateCombatLog("winner is: " + dfndr.name);
            this.status = 0;
        } else {
            Display.updateCombatLog("Combat continues");
        }
        return win;
    }

    //method to reset stats once battle is over
}

class Display {
    static updateCombatStats = () => {
        for (let i = 0; i < document.querySelectorAll(".ch").length; i++) {
            const charContainers = document.querySelectorAll(".ch");
            charContainers[i].children[1].innerHTML = `${i === 0 ? ch1.name : ch2.name}`;
            charContainers[i].children[2].innerHTML = `${i === 0 ? ch1.hp : ch2.hp}/${i === 0 ? ch1.hpOrigin : ch2.hpOrigin}HP`;
        }
    }

    static updateCombatLog = (log) => {
        const combatLog = document.querySelector(".combat-log");
        combatLog.value += log + "\n";
    }

    static attack = () => {
        const background = document.querySelector("body");
        background.style.backgroundColor = "red";
        setTimeout(() => {
            background.style.backgroundColor = "white";
        }, 1000)
    }

}

const fetching = (name, el) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`)
        .then((response) => {
            return response.json();
        }).then((data) => {
            const sprite = data.sprites.front_default;
            const imgEl = document.querySelector(`.${el}`);
            imgEl.style.height = 100;
            imgEl.style.width = 100;
            imgEl.src = sprite;
        });
    console.log("hola", document.querySelector(`.${el}`))

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
    const battleMusic = document.querySelector(".audio");
    battleMusic.autoplay = true;
    battleMusic.loop = true;
    combat.beginCombat();
});

const btnAttack = document.getElementById("btn-attack");
btnAttack.addEventListener("click", () => {
    combat.doTurn();
});

const btnHeal = document.getElementById("btn-heal");
btnHeal.addEventListener("click", () => {
    ch2.heal();
})