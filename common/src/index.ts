
export enum team {
  blue,
  red,
}

export type entityType = 'child' | 'death' | 'devil' | 'dwarf' | 'flag' | 'king' | 'knight'
  | 'mommy' | 'ninja' | 'ninja2' | 'odin' | 'thor' | 'troll' | 'vampire' | 'viking' | 'wizard';
export class Board {
  public board: Cell[][];

  constructor() {
    this.board = [[], [], [], [], [], [], [], []];

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        this.board[y][x] = new Cell(x, y, color.red);
      }
    }
  }

  public getCell(x: number, y: number) {
    return this.board[y][x];
  }

  public getEntity(x: number, y: number) {
    return this.board[y][x].entity;
  }
}

export class Cell {
  public entity: Entity | null;

  constructor(public x: number, public y: number, public color: color) {
    this.entity = null;
  }

  public isEmpty() {
    return this.entity === null;
  }
}

export enum color {
  noColor = 0,
  red = 1,
  redlight = 2,
  green = 3,
  blue = 4,
  yellow = 5,
  grey = 6,
}

export class MarkerBoard {
  public markerBoard: color[][];

  constructor() {
    this.markerBoard = [[], [], [], [], [], [], [], []];
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        this.markerBoard[y][x] = 0;
      }
    }
  }

  public setHighlight(x: number, y: number, highlightColor: color = color.green) {
    this.markerBoard[y][x] = highlightColor;
  }

  public isHighlighted(x: number, y: number) {
    return this.markerBoard[y][x] !== color.noColor;
  }

  public returnHighlightType(x: number, y: number) {
    return this.markerBoard[y][x];
  }

  /**
   * Returns true if the board has at least 1 highlight
   */
  public hasAnyHighlight() {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (this.isHighlighted(x, y)) {
          return true;
        }
      }
    }

    return false;
  }
}

export class Entity {
  public type: entityType;
  public team: team;
  public isVisible: boolean;
  public level: number;

  constructor() {
    this.isVisible = false;
  }

  public getPossibleMoves(x: number, y: number, board: Board): MarkerBoard {
    const markerBoard = new MarkerBoard();
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (Math.abs(i) + Math.abs(j) === 2) continue;
        if (this.isInsideBorders(x + i, y + j) &&
          (board.getCell(x + i, y + j).isEmpty() || board.getEntity(x + i, y + j)?.team !== this.team)) {
          markerBoard.setHighlight(x + i, y + j);
        }
      }
    }
    return markerBoard;
  }

  public effectOnEntity(enemyEntity: Entity, board: Board) {
    enemyEntity.isVisible = true;
    this.isVisible = true;
    if (this.level > enemyEntity.level){
      enemyEntity.kill;
    }
    else if (this.level <= enemyEntity.level){
      this.kill;
    }

    // if(enemyEntity.type === "bomb") {
    //handle bomb
    // }
  }

  public kill(entity: Entity) {
    entity = null;
  }

  public isInsideBorders(x: number, y: number) {
    return x >= 0 && x <= 7 && y >= 0 && y <= 7;
  }

  public static getImage?(entity: Entity);
}

export class Child extends Entity {
  constructor(team: team) {
    super();
    this.type = 'child';
    this.team = team;
    this.level = 1;
  }
}

export class Death extends Entity {
  constructor(team: team) {
    super();
    this.type = 'death';
    this.team = team;
    this.level = 1;
  }
}

export class Devil extends Entity {
  constructor(team: team) {
    super();
    this.type = 'devil';
    this.team = team;
    this.level = 1;
  }
}

export class Dwarf extends Entity {
  constructor(team: team) {
    super();
    this.type = 'dwarf';
    this.team = team;
    this.level = 1;
  }
}

export class Flag extends Entity {
  constructor(team: team) {
    super();
    this.type = 'flag';
    this.team = team;
    this.level = 0;
  }
  public override getPossibleMoves(x: number, y: number, board: Board): MarkerBoard {
    return new MarkerBoard();
  }
  public override effectOnEntity(entity: Entity, board: Board) {
  }
}

export class King extends Entity {
  constructor(team: team) {
    super();
    this.type = 'king';
    this.team = team;
    this.level = 3;
  }
}

export class Knight extends Entity {
  constructor(team: team) {
    super();
    this.type = 'knight';
    this.team = team;
    this.level = 1;
  }
}

export class Mommy extends Entity {
  constructor(team: team) {
    super();
    this.type = 'mommy';
    this.team = team;
    this.level = 10;
  }
}

export class Ninja extends Entity {
  constructor(team: team) {
    super();
    this.type = 'ninja';
    this.team = team;
    this.level = 1;
  }
}

export class Ninja2 extends Entity {
  constructor(team: team) {
    super();
    this.type = 'ninja2';
    this.team = team;
    this.level = 1;
  }
}

export class Odin extends Entity {
  constructor(team: team) {
    super();
    this.type = 'odin';
    this.team = team;
    this.level = 3;
  }
}

export class Thor extends Entity {
  constructor(team: team) {
    super();
    this.type = 'thor';
    this.team = team;
    this.level = 2;
  }
}

export class Troll extends Entity {
  constructor(team: team) {
    super();
    this.type = 'troll';
    this.team = team;
    this.level = 5;
  }
}

export class Vampire extends Entity {
  constructor(team: team) {
    super();
    this.type = 'vampire';
    this.team = team;
    this.level = 6;
  }
}

export class Viking extends Entity {
  constructor(team: team) {
    super();
    this.type = 'viking';
    this.team = team;
    this.level = 2;
  }
}

export class Wizard extends Entity {
  constructor(team: team) {
    super();
    this.type = 'wizard';
    this.team = team;
    this.level = 1;
  }
}

export type IPiecesSetup = {
  [key in entityType]: number;
};

export class Team {
  public piecesSetup: IPiecesSetup;
  public isReady: boolean;
  public readonly FIRST_COLUMN;
  public readonly SECOND_COLUMN;

  constructor(public team: team, firstColumn: number, secondColumn: number) {
    this.isReady = false;
    this.FIRST_COLUMN = firstColumn;
    this.SECOND_COLUMN = secondColumn;
  }
}

export class Position {
  x: number;
  y: number;
}

export class GameManager {
  public board: Board;
  public setupFinished: boolean;
  public blueTeam: Team;
  public redTeam: Team;
  public teamTurn: Team;
  public turnCount: number;

  public setup_setPiece(entity: Entity, pos: Position) {
    if (this.setupFinished) throw new Error('Setup is finished');

    const { x, y } = pos;
    const t = entity.team;
    let currentTeam: Team;
    let allowedYColumn: number;
    if (t === team.blue) {
      currentTeam = this.blueTeam;
      allowedYColumn = this.blueTeam.FIRST_COLUMN;
    } else {
      currentTeam = this.redTeam;
      allowedYColumn = this.redTeam.FIRST_COLUMN;
    }

    if (y !== allowedYColumn) {
      throw new Error('Position is not allowed for setup.');
    }

    if (this.board.getCell(x, y).entity !== null) {
      throw new Error('Cannot place pieces where a piece is already placed');
    }

    this.board.getCell(x, y).entity = entity;
    currentTeam.piecesSetup[entity.type] -= 1;
  }

  public setPiece(entity: Entity, pos: Position) {
    if (this.setupFinished) throw new Error('Setup is finished');
    const { x, y } = pos;

    if (this.board.getCell(x, y).entity !== null) {
      throw new Error('Cannot place pieces where a piece is already placed');
    }

    this.board.getCell(x, y).entity = entity;
  }

  public move(newPos: Position, currPos: Position) {
    const entity: Entity = this.board.getEntity(currPos.x, currPos.y);

    if (entity.team !== this.teamTurn.team) {
      throw new Error('Its not the turn of team: ' + entity.team.toString());
    }

    if (!this.setupFinished) {
      throw new Error('Setup is not finished');
    }

    const isMovePossible = entity
      .getPossibleMoves?.(currPos.x, currPos.y, this.board)
      .isHighlighted(newPos.x, newPos.y);

    if (!isMovePossible) {
      console.error('new Pos: ', newPos);
      console.error('curr Pos: ', currPos);
      console.error('entity Pos: ', entity);

      throw new Error('Move is not possible');
    }
    if (this.board.getCell(newPos.x, newPos.y).entity !== null) {
      entity.effectOnEntity?.(this.board.getCell(newPos.x, newPos.y).entity as Entity, this.board);
    } else {
      this.board.getCell(newPos.x, newPos.y).entity = entity;
      this.board.getCell(currPos.x, currPos.y).entity = null;
    }

    this.passTurn();
  }

  public setReady(t: Team) {
    t.isReady = true;

    if (this.blueTeam.isReady && this.redTeam.isReady) {
      for (let i = 0; i < 8; i++) {
        if (this.board.getCell(i, this.blueTeam.FIRST_COLUMN).entity == null) {
          this.setPiece(new Child(team.blue), { x: i, y: this.blueTeam.FIRST_COLUMN });
        }
      }

      for (let i = 0; i < 8; i++) {
        if (this.board.getCell(i, this.redTeam.FIRST_COLUMN).entity == null) {
          this.setPiece(new Child(team.red), { x: i, y: this.redTeam.FIRST_COLUMN });
        }
      }

      this.setupFinished = true;
    }
  }

  public getOppositeTeam(oppositeTeam: Team) {
    return oppositeTeam.team === team.red ? this.blueTeam : this.redTeam;
  }

  public passTurn() {
    this.teamTurn = this.getOppositeTeam(this.teamTurn);
    this.turnCount++;
  }

  constructor(init: boolean = false) {
    if (init) {
      this.board = new Board();
    }
  }
}

export interface IGameManagerData {
  redTeam: Team;
  blueTeam: Team;
  teamTurn: team;
  board: Cell[][];
  turnCount: number;
  setupFinished: boolean;
}

export class GameManagerFactory {
  public static getClone(gameManager: GameManager): GameManager {
    const clone = new GameManager();

    clone.blueTeam = gameManager.blueTeam;
    clone.redTeam = gameManager.redTeam;
    clone.board = gameManager.board;
    clone.setupFinished = gameManager.setupFinished;
    clone.turnCount = gameManager.turnCount;
    clone.teamTurn = gameManager.teamTurn;
    return clone;
  }

  public static initGameManager(): GameManager {
    const instance = new GameManager();
    instance.board = new Board();
    instance.setupFinished = false;
    instance.blueTeam = new Team(team.blue, 0, 1);
    instance.redTeam = new Team(team.red, 7, 6);
    instance.blueTeam.piecesSetup = { king: 0, death:0, devil: 0, dwarf:0, flag: 0, knight:0, mommy: 0, ninja:0, ninja2: 0, odin:0, thor: 0, troll:1, vampire: 0, viking:0, wizard: 0, child: 0 };
    // instance.blueTeam.piecesSetup = { king: 0, death:1, devil: 1, dwarf:1, flag: 1, knight:0, mommy: 1, ninja:1, ninja2: 0, odin:0, thor: 0, troll:1, vampire: 0, viking:0, wizard: 1, child: 0 };
    // instance.redTeam.piecesSetup = { king: 0, death:1, devil: 1, dwarf:1, flag: 1, knight:0, mommy: 1, ninja:1, ninja2: 0, odin:0, thor: 0, troll:1, vampire: 0, viking:0, wizard: 1, child: 0 };
    instance.redTeam.piecesSetup = { king: 0, death:0, devil: 0, dwarf:0, flag: 0, knight:0, mommy: 0, ninja:0, ninja2: 0, odin:0, thor: 0, troll:1, vampire: 0, viking:0, wizard: 0, child: 0 };

    instance.turnCount = 0;
    instance.teamTurn = instance.redTeam;

    for (let i = 0; i < 8; i++) {
      instance.board.getCell(i, 6).entity = new Child(team.red);
    }

    for (let i = 0; i < 8; i++) {
      instance.board.getCell(i, 1).entity = new Child(team.blue);
    }

    return instance;
  }

  private static restoreTeam(t: Team) {
    const restored = new Team(t.team, t.FIRST_COLUMN, t.SECOND_COLUMN);
    restored.isReady = t.isReady;
    restored.piecesSetup = t.piecesSetup;
    return restored;
  }

  private static restoreBoard(board: Cell[][]) {
    const restored = new Board();
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        restored.board[i][j] = new Cell(j, i, color.yellow);
        restored.board[i][j].entity = this.restoreEntity(board[i][j].entity);
      }
    }

    return restored;
  }

  private static restoreEntity(entity: Entity) {
    if (entity == null) {
      return null;
    }

    let restored: Entity;
    switch (entity.type) {
      case 'king':
        restored = new King(entity.team);
        break;
      case 'child':
        restored = new Child(entity.team);
        break;
    }

    restored.isVisible = entity.isVisible;
    return restored;
  }

  public static restoreGame(data: IGameManagerData): GameManager {
    const { board, setupFinished, teamTurn, turnCount, redTeam, blueTeam } = data;
    const instance = new GameManager(true);

    instance.blueTeam = this.restoreTeam(blueTeam);
    instance.redTeam = this.restoreTeam(redTeam);
    instance.board = this.restoreBoard(board);
    instance.setupFinished = setupFinished;
    instance.teamTurn = redTeam.team === teamTurn ? instance.redTeam : instance.blueTeam;
    instance.turnCount = turnCount;

    return instance;
  }

  public static getData(gameManager: GameManager): IGameManagerData {
    const { blueTeam, board, setupFinished, teamTurn, turnCount, redTeam } = gameManager;

    const data = {
      redTeam: redTeam,
      blueTeam: blueTeam,
      teamTurn: teamTurn.team,
      board: board.board,
      turnCount: turnCount,
      setupFinished: setupFinished,
    };

    return data;
  }
}

export interface IGameDetails {
  player1: {
    id: string;
    team: team;
    challenger: boolean;
  };
  player2: {
    id: string;
    team: team;
    challenger: boolean;
  };
  game_data: IGameManagerData;
}
