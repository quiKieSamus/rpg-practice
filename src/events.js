/**
 * @type {HTMLButtonElement}
 */
const btnBegin = document.querySelector("#btn-begin");
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
/**
 * @type {HTMLButtonElement}
 */
const btnAttack = document.querySelector("#btn-attack");
btnAttack.addEventListener("click", () => {
    const op = "atk";
    combat.doTurn(ch2, ch1, op);
    // combat.playerMoveDone();
    Display.hideControls();
});
/**
 * @type {HTMLButtonElement}
 */
const btnHeal = document.querySelector("#btn-heal");
btnHeal.addEventListener("click", () => {
    const op = "heal";
    // combat.playerMoveDone();
    combat.doTurn(ch2, ch1, op);
    Display.hideControls();
})
/**
 * @type {HTMLButtonElement}
 */
const btnDefend = document.querySelector("#btn-defend");
btnDefend.addEventListener("click", () => {
    const op = "def";
    combat.doTurn(ch2, ch1, op);
    Display.hideControls();

});
/**
 * @type {HTMLButtonElement}
 */
const btnStats = document.querySelector("#btn-stats");
btnStats.addEventListener("click", () => {
    Display.playerStats();
});

/**
 * @type {HTMLButtonElement}
 */
const btnNext = document.querySelector("#btn-next");
btnNext.addEventListener("click", () => {
    combat.cpuMove();
    Display.showControls();
});

// info button
const btnInfo = document.querySelector("#btn-info");
btnInfo.addEventListener("click", (e) => {
    informationDialog.showModal();
});
// modal to display when hitting info button
/**
 * @type {HTMLDialogElement}
 */
const informationDialog = document.querySelector(".information");

/**
 * @type {HTMLButtonElement}
 */
const informationCloseBtn = document.querySelector(".information-btn-close");
informationCloseBtn.addEventListener("click", e => informationDialog.close());