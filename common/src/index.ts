export enum team {
  blue,
  red,
}

export type entityType = 'child' | 'death' | 'devil' | 'dwarf' | 'flag'  | 'knight'
  | 'mommy' | 'ninja' | 'odin' | 'thor' | 'troll' | 'viking' | 'wizard';
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
    this.isVisible = true;
  }

  public getPosition(board: Board): Position | null {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (board.getCell(x, y).entity === this) {
          return { x, y };
        }
      }
    }
    return null;
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
    let message = "well..whats your next move??";
    enemyEntity.isVisible = true;
    this.isVisible = true;
    const minePosition = this.getPosition(board);
    const enemyPosition = enemyEntity.getPosition(board);
    if (this.level > enemyEntity.level){
      this.kill(board, enemyPosition);
      this.set(board,enemyPosition);
      this.kill(board, minePosition);
      message = enemyEntity.type + " executed!";
      if (this.type === "child" || this.type === 'knight' || this.type === "viking" || this.type === 'thor'){
        this.upgrade(board, this, enemyPosition);
        message = message + "\n and your " + this.type + " get some upgrades ha?"
      }
    }
    else if (this.level <= enemyEntity.level){
      this.kill(board, minePosition);
      if (enemyEntity.type === "child" || enemyEntity.type === 'knight' || enemyEntity.type === "viking" || enemyEntity.type === 'thor') {
        this.upgrade(board, enemyEntity, enemyPosition);
      }
      message = "sorry to tell but...you just lose " + this.type;
    }
    if (enemyEntity.type === 'flag'){
      return this.team.toString();
    }
    else if (enemyEntity.type === 'death'){
      enemyEntity.kill(board, enemyPosition);
      if (this.type!== 'devil'){
        this.kill(board, minePosition);
        message = "sorry to tell but...you just lose " + this.type + " to death..";
      }
    }
    return message;
  }

  public kill(board: Board, currPos: Position) {
    board.getCell(currPos.x, currPos.y).entity = null;
  }

  public set(board: Board, currPos: Position) {
    board.getCell(currPos.x, currPos.y).entity = this;
  }

  public upgrade(board: Board, entity: Entity, position: Position) {
    if(entity.type === "child"){
      if(entity.isVisible){
        board.getCell(position.x, position.y).entity = new Knight(entity.team);
        board.getCell(position.x, position.y).entity.isVisible = true;
      }
      else {
        board.getCell(position.x, position.y).entity = new Knight(entity.team);}
      return (new Knight(entity.team))
    }
    else if(entity.type === "knight"){
      if(entity.isVisible){
        board.getCell(position.x, position.y).entity = new Viking(entity.team);
        board.getCell(position.x, position.y).entity.isVisible = true;
      }
      else {
        board.getCell(position.x, position.y).entity = new Viking(entity.team);}
      return (new Viking(entity.team))
    }
    else if(entity.type === "viking"){
      if(entity.isVisible){
        board.getCell(position.x, position.y).entity = new Thor(entity.team);
        board.getCell(position.x, position.y).entity.isVisible = true;
      }
      else {
        board.getCell(position.x, position.y).entity = new Thor(entity.team);}
      return (new Thor(entity.team))
    }
    else if(entity.type === "thor"){
      if(entity.isVisible){
        board.getCell(position.x, position.y).entity = new Odin(entity.team);
        board.getCell(position.x, position.y).entity.isVisible = true;
      }
      else {
        board.getCell(position.x, position.y).entity = new Odin(entity.team);}
      return (new Odin(entity.team))
    }
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
    this.level = 6;
  }
  public override effectOnEntity(enemyEntity: Entity, board: Board) {
    this.isVisible = true;
    enemyEntity.isVisible = true;
    const minePosition = this.getPosition(board);
    const enemyPosition = enemyEntity.getPosition(board);
    this.kill(board, minePosition);
    if (enemyEntity.type !== 'mommy' && enemyEntity.type !== 'flag'){
      enemyEntity.kill(board, enemyPosition);
      return  enemyEntity.type + " executed!"
    }
    if (enemyEntity.type === 'flag'){
      return this.team.toString();
    }
    return "you cant kill the deads!";
  }
}

export class Devil extends Entity {
  constructor(team: team) {
    super();
    this.type = 'devil';
    this.team = team;
    this.level = 1;
  }
  public override effectOnEntity(enemyEntity: Entity, board: Board) {
    this.isVisible = true;
    enemyEntity.isVisible = true;
    const minePosition = this.getPosition(board);
    board.getCell(minePosition.x, minePosition.y).entity = EntityFactory.createEntity(enemyEntity.type, this.team);
    return "your devil became " + enemyEntity.type + "!";
  }
}

export class Dwarf extends Entity {
  constructor(team: team) {
    super();
    this.type = 'dwarf';
    this.team = team;
    this.level = 0.5;
  }
  public override effectOnEntity(enemyEntity: Entity, board: Board) {
    this.isVisible = true;
    enemyEntity.isVisible = true;
    const minePosition = this.getPosition(board);
    const enemyPosition = enemyEntity.getPosition(board);
    if (enemyEntity.type === "troll"){
      enemyEntity.kill(board, enemyPosition);
      this.set(board,enemyPosition);
      this.kill(board, minePosition);
      return "your dwarf just captured the troll!";
    }
    else if (enemyEntity.type === 'flag'){
      return this.team.toString();
    }
    else if (enemyEntity.type === 'devil'){
      this.kill(board, minePosition);
      board.getCell(minePosition.x, minePosition.y).entity = EntityFactory.createEntity(enemyEntity.type, this.team);
      return "your became a devil!";
    }
    else if (enemyEntity.type === 'death'){
      this.kill(board, minePosition);
      enemyEntity.kill(board, enemyPosition);
      return "he was a good dwarf, but death its a serious thing.";
    }
    else {this.kill(board, minePosition);}
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
}

export class Knight extends Entity {
  constructor(team: team) {
    super();
    this.type = 'knight';
    this.team = team;
    this.level = 2;
  }
}

export class Mommy extends Entity {
  constructor(team: team) {
    super();
    this.type = 'mommy';
    this.team = team;
    this.level = 8;
  }
  public override getPossibleMoves(x: number, y: number, board: Board): MarkerBoard {
    return new MarkerBoard();
  }
}

export class Ninja extends Entity {
  constructor(team: team) {
    super();
    this.type = 'ninja';
    this.team = team;
    this.level = 4;
  }

  public override getPossibleMoves(x: number, y: number, board: Board): MarkerBoard {
    const markerBoard = new MarkerBoard();
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        if (Math.abs(i) + Math.abs(j) > 2 || Math.abs(i) === Math.abs(j)) continue;
        if (this.isInsideBorders(x + i, y + j) &&
          (board.getCell(x + i, y + j).isEmpty() || board.getEntity(x + i, y + j)?.team !== this.team)) {
          markerBoard.setHighlight(x + i, y + j);
        }
      }
    }
    return markerBoard;
  }
}

export class Odin extends Entity {
  constructor(team: team) {
    super();
    this.type = 'odin';
    this.team = team;
    this.level = 5;
  }
}

export class Thor extends Entity {
  constructor(team: team) {
    super();
    this.type = 'thor';
    this.team = team;
    this.level = 4;
  }
}

export class Troll extends Entity {
  constructor(team: team) {
    super();
    this.type = 'troll';
    this.team = team;
    this.level = 7;
  }
  public override effectOnEntity(enemyEntity: Entity, board: Board) {
    this.isVisible = true;
    enemyEntity.isVisible = true;
    const minePosition = this.getPosition(board);
    const enemyPosition = enemyEntity.getPosition(board);

    if (enemyEntity.type === "dwarf" || enemyEntity.type === "mommy"){
      this.kill(board, minePosition);
      return this.type + " executed!";}
    else if (enemyEntity.type === 'devil'){
      board.getCell(enemyPosition.x, enemyPosition.y).entity = EntityFactory.createEntity(this.type, enemyEntity.team);
      return "clone of a troll... that's not good.."
    }
    else {
      enemyEntity.kill(board, enemyPosition);
      this.set(board,enemyPosition);
      this.kill(board, minePosition);
    }
    if (enemyEntity.type === 'flag'){
      return this.team.toString();
    }
  }
}

export class Viking extends Entity {
  constructor(team: team) {
    super();
    this.type = 'viking';
    this.team = team;
    this.level = 3;
  }
}

export class Wizard extends Entity {
  public train: number;
  public reveal: number;

  constructor(team: team) {
    super();
    this.type = 'wizard';
    this.team = team;
    this.level = 1;
    this.train = 3;
    this.reveal = 1;
  }
}

class EntityFactory {
  static createEntity(type: string, team: team): Entity {
    switch (type) {
      case 'child':
        return new Child(team);
      case 'death':
        return new Death(team);
      case 'devil':
        return new Devil(team);
      case 'dwarf':
        return new Dwarf(team);
      case 'flag':
        return new Flag(team);
      case 'knight':
        return new Knight(team);
      case 'mommy':
        return new Mommy(team);
      case 'ninja':
        return new Ninja(team);
      case 'odin':
        return new Odin(team);
      case 'thor':
        return new Thor(team);
      case 'troll':
        return new Troll(team);
      case 'viking':
        return new Viking(team);
      case 'wizard':
        return new Wizard(team);
      default:
        throw new Error(`Unknown entity type: ${type}`);
    }
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
  public endgame: string;

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

  public setPiece(entity: Entity, pos: Position, flag: boolean) {
    if (this.setupFinished && !flag) throw new Error('Setup is finished');
    const { x, y } = pos;
    if (this.board.getCell(x, y).entity !== null && !flag) {
      throw new Error('Cannot place pieces where a piece is already placed');
    }
    this.board.getCell(x, y).entity = entity;
  }

  public move(newPos: Position, currPos: Position) {
    // tie
    if(newPos.x === -1){
      this.endGame("tie")
      return "message";
    }
    let message = "well..whats your next move??"
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
      message = entity.effectOnEntity?.(this.board.getCell(newPos.x, newPos.y).entity as Entity, this.board);
    } else {
      this.board.getCell(newPos.x, newPos.y).entity = entity;
      this.board.getCell(currPos.x, currPos.y).entity = null;
    }
    this.passTurn();
    if(message === "1"){this.endGame("red")
    message = "red won the game!"}
    else if(message === "0"){this.endGame("blue")
      message = "blue won the game!"}
    return message;
  }

  public setReady(t: Team) {
    t.isReady = true;
    if (this.blueTeam.isReady && this.redTeam.isReady) {
      for (let i = 0; i < 8; i++) {
        if (this.board.getCell(i, this.blueTeam.FIRST_COLUMN).entity == null) {
          this.setPiece(new Child(team.blue), { x: i, y: this.blueTeam.FIRST_COLUMN }, false);
        }
      }

      for (let i = 0; i < 8; i++) {
        if (this.board.getCell(i, this.redTeam.FIRST_COLUMN).entity == null) {
          this.setPiece(new Child(team.red), { x: i, y: this.redTeam.FIRST_COLUMN }, false);
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

  public endGame(message: string) {
    this.endgame = message;
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
  endgame: string;
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
    clone.endgame = gameManager.endgame;
    return clone;
  }

  public static initGameManager(): GameManager {
    const instance = new GameManager();
    instance.board = new Board();
    instance.setupFinished = false;
    instance.blueTeam = new Team(team.blue, 0, 1);
    instance.redTeam = new Team(team.red, 7, 6);
    // instance.blueTeam.piecesSetup = {death:1, devil: 1, dwarf:1, flag: 1, knight:0, mommy: 1, ninja:1, odin:0, thor: 0, troll:1, viking:0, wizard: 1, child: 0 };
    // instance.redTeam.piecesSetup = {death:1, devil: 1, dwarf:1, flag: 1, knight:0, mommy: 1, ninja:1, odin:0, thor: 0, troll:1, viking:0, wizard: 1, child: 0 };
    instance.redTeam.piecesSetup = {death:0, devil: 0, dwarf:0, flag: 1, knight:0, mommy: 0, ninja:0, odin:0, thor: 0, troll:0, viking:0, wizard: 0, child: 0 };
    instance.blueTeam.piecesSetup = {death:0, devil: 0, dwarf:0, flag: 1, knight:0, mommy: 0, ninja:0, odin:0, thor: 0, troll:0, viking:0, wizard: 0, child: 0 };

    instance.turnCount = 0;
    instance.teamTurn = instance.redTeam;
    instance.endgame = "none";

    for (let i = 0; i < 8; i++) {
      instance.board.getCell(i, 3).entity = new Flag(team.red);
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
      case 'child':
        restored = new Child(entity.team);
        break;
      case 'death':
        restored = new Death(entity.team);
        break;
      case 'devil':
        restored = new Devil(entity.team);
        break;
      case 'dwarf':
        restored = new Dwarf(entity.team);
        break;
      case 'flag':
        restored = new Flag(entity.team);
        break;
      case 'knight':
        restored = new Knight(entity.team);
        break;
      case 'mommy':
        restored = new Mommy(entity.team);
        break;
      case 'ninja':
        restored = new Ninja(entity.team);
        break;
      case 'odin':
        restored = new Odin(entity.team);
        break;
      case 'thor':
        restored = new Thor(entity.team);
        break;
      case 'troll':
        restored = new Troll(entity.team);
        break;
      case 'viking':
        restored = new Viking(entity.team);
        break;
      case 'wizard':
        restored = new Wizard(entity.team);
        break;
    }

    restored.isVisible = entity.isVisible;
    return restored;
  }

  public static restoreGame(data: IGameManagerData): GameManager {
    const { board, setupFinished, teamTurn, turnCount, redTeam, blueTeam, endgame } = data;
    const instance = new GameManager(true);

    instance.blueTeam = this.restoreTeam(blueTeam);
    instance.redTeam = this.restoreTeam(redTeam);
    instance.board = this.restoreBoard(board);
    instance.setupFinished = setupFinished;
    instance.teamTurn = redTeam.team === teamTurn ? instance.redTeam : instance.blueTeam;
    instance.turnCount = turnCount;
    instance.endgame = endgame;

    return instance;
  }

  public static getData(gameManager: GameManager): IGameManagerData {
    const { blueTeam, board, setupFinished, teamTurn, turnCount, redTeam,endgame } = gameManager;

    const data = {
      redTeam: redTeam,
      blueTeam: blueTeam,
      teamTurn: teamTurn.team,
      board: board.board,
      turnCount: turnCount,
      endgame: endgame,
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