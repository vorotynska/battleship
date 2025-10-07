// __test__/domController.test.js
/**
 * @jest-environment jsdom
 */
const {
    DOMController
} = require("../src/domController");
const {
    Game
} = require("../src/game");

/**
 * @jest-environment jsdom
 */
const {
    DOMController
} = require("../src/domController");

test("renders initial message", () => {
    document.body.innerHTML = `
    <div id="message"></div>
    <div id="player-board"></div>
    <div id="cpu-board"></div>
  `;
    const dom = new DOMController();
    dom.updateMessage("Привет!");
    expect(document.querySelector("#message").textContent).toBe("Привет!");
});


/**
 * простые тесты DOM
 * Создание DOM-структуры досок 1
 */
/**
 * @jest-environment jsdom
 */
const {
    DOMController
} = require("../src/domController");
const {
    Game
} = require("../src/game");

document.body.innerHTML = `
  <div id="player-board"></div>
  <div id="cpu-board"></div>
  <div id="message"></div>
  <button id="restart-btn">Restart</button>
`;

describe("DOMController", () => {
    let dom;

    beforeEach(() => {
        dom = new DOMController();
    });

    test("инициализирует игру и создает доски", () => {
        const playerCells = document.querySelectorAll("#player-board .cell");
        const cpuCells = document.querySelectorAll("#cpu-board .cell");
        expect(playerCells.length).toBeGreaterThan(0);
        expect(cpuCells.length).toBeGreaterThan(0);
    });

    test("обновляет сообщение игроку", () => {
        dom.updateMessage("Тестовое сообщение");
        expect(document.querySelector("#message").textContent).toBe("Тестовое сообщение");
    });

    test("перезапускает игру при нажатии кнопки", () => {
        const oldGame = dom.game;
        document.querySelector("#restart-btn").click();
        expect(dom.game).not.toBe(oldGame);
    });
});



// Чтобы изолировать тесты от реальной логики игры
jest.mock("../src/game");

describe("DOMController UI tests", () => {
    let dom;

    beforeEach(() => {
        // Минимальная разметка для тестов
        document.body.innerHTML = `
      <div id="message"></div>
      <div id="player-board"></div>
      <div id="cpu-board"></div>
    `;

        // Мокаем игру (чтобы не запускать реальную логику боя)
        Game.mockImplementation(() => ({
            human: {
                board: {
                    grid: Array.from({
                        length: 2
                    }, () => Array.from({
                        length: 2
                    }, () => ({
                        hasShip: false
                    })))
                }
            },
            computer: {
                board: {
                    grid: Array.from({
                        length: 2
                    }, () => Array.from({
                        length: 2
                    }, () => ({
                        hasShip: false
                    })))
                }
            },
            gameOver: false,
            getWinner: jest.fn(() => null),
            getCurrentPlayer: jest.fn(() => "human"),
            humanAttack: jest.fn(() => ({
                result: "hit"
            })),
            computerAttack: jest.fn(() => ({
                result: "miss"
            })),
        }));

        dom = new DOMController();
        dom.init();
    });

    test("renders boards in the DOM", () => {
        expect(document.querySelectorAll(".row").length).toBeGreaterThan(0);
        expect(document.querySelectorAll(".cell").length).toBeGreaterThan(0);
    });

    test("updates message text", () => {
        dom.updateMessage("Ваш ход!");
        expect(document.querySelector("#message").textContent).toBe("Ваш ход!");
    });

    test("handles click on enemy cell", () => {
        const firstCell = document.querySelector("#cpu-board .cell");
        firstCell.click(); // симулируем клик

        // Проверяем, что после клика сообщение обновилось
        expect(document.querySelector("#message").textContent).toContain("Ход");
    });
});