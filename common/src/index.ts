import {Child, Death, Devil, Dworf, Flag, King, Knight, Mommy, Ninja, Ninja2, Odin, Thor, Troll, Vampire, Viking, Wizard} from './Entitys';
export enum team {
  blue,
  red,
}

export type entityType = 'child' | 'death' | 'devil' | 'dworf' | 'flag' | 'king' | 'knight'
  | 'mommy' | 'ninja' | 'ninja2' | 'odin' | 'thor' | 'troll' | 'vampire' | 'viking' | 'wizard';

export enum printType {
  types,
  visibility,
}
export class Board {
  public board: Cell[][];

  constructor() {
    this.board = [[], [], [], [], [], [], [], []];

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        this.board[y][x] = new Cell(x, y);
      }
    }
  }

  public getCell(x: number, y: number) {
    return this.board[y][x];
  }

  public getEntity(x: number, y: number) {
    return this.board[y][x].entity;
  }

  public getClone() {
    const clone = new Board();
    clone.board = [...this.board];
    return clone;
  }

  /**
   * helper function
   */
  public printBoard(pt: printType = printType.types) {
    let str = '';

    if (pt === printType.types) {
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          str += this.board[i][j].isEmpty() ? '0'.padStart(4, ' ').padEnd(4, ' ') : this.board[i][j].entity?.type;
          str += ', ';
        }
        str += '\n';
      }
    } else if (pt === printType.visibility) {
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          str += this.board[i][j].isEmpty()
            ? '0'.padStart(4, ' ').padEnd(4, ' ')
            : this.board[i][j].entity?.isVisible?.toString();
          str += ', ';
        }
        str += '\n';
      }
    }

    console.log(str);
  }
}

export class Cell {
  public entity: Entity | null;

  constructor(public x: number, public y: number) {
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

  constructor() {
    this.isVisible = false;
  }

  public getPossibleMoves(x: number, y: number, board: Board): MarkerBoard {
    const markerBoard = new MarkerBoard();
    if (
      this.team === team.blue &&
      this.isInsideBorders(x, y + 1) &&
      (board.getCell(x, y + 1).isEmpty() || board.getEntity(x, y + 1)?.team !== this.team)
    ) {
      markerBoard.setHighlight(x, y + 1);
    } else if (
      this.isInsideBorders(x, y - 1) &&
      (board.getCell(x, y - 1).isEmpty() || board.getEntity(x, y - 1)?.team !== this.team)
    ) {
      markerBoard.setHighlight(x, y - 1);
    }
    return markerBoard;
  }
  protected isInsideBorders(x: number, y: number) {
    return x >= 0 && x <= 7 && y >= 0 && y <= 7;
  }

  public effectOnEntity(enemyEntity: Entity, board: Board) {
    enemyEntity.isVisible = true;
    this.isVisible = true;
  }
  public static getImage?(entity: Entity);
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

    const leftSetupCount = currentTeam.piecesSetup[entity.type];
    if (leftSetupCount <= 0) {
      throw new Error('Reached max pieces that are allowed.');
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
    const t = entity.team;
    let currentTeam: Team;
    if (t === team.blue) {
      currentTeam = this.blueTeam;
    } else {
      currentTeam = this.redTeam;
    }

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
    instance.blueTeam.piecesSetup = { king: 2, child: 0 };
    instance.redTeam.piecesSetup = { king: 2, child: 0 };

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
        restored.board[i][j] = new Cell(j, i);
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
