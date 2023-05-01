import { Board, Entity, MarkerBoard, team } from './index';
export class Child extends Entity {
  constructor(team: team) {
    super();
    this.type = 'child';
    this.team = team;
  }
}

export class Death extends Entity {
  constructor(team: team) {
    super();
    this.type = 'death';
    this.team = team;
  }
}

export class Devil extends Entity {
  constructor(team: team) {
    super();
    this.type = 'devil';
    this.team = team;
  }
}

export class Dworf extends Entity {
  constructor(team: team) {
    super();
    this.type = 'dworf';
    this.team = team;
  }
}

export class Flag extends Entity {
  constructor(team: team) {
    super();
    this.type = 'flag';
    this.team = team;
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
  }
}

export class Knight extends Entity {
  constructor(team: team) {
    super();
    this.type = 'knight';
    this.team = team;
  }
}

export class Mommy extends Entity {
  constructor(team: team) {
    super();
    this.type = 'mommy';
    this.team = team;
  }
}

export class Ninja extends Entity {
  constructor(team: team) {
    super();
    this.type = 'ninja';
    this.team = team;
  }
}

export class Ninja2 extends Entity {
  constructor(team: team) {
    super();
    this.type = 'ninja2';
    this.team = team;
  }
}

  export class Odin extends Entity {
    constructor(team: team) {
      super();
      this.type = 'odin';
      this.team = team;
    }
  }

  export class Thor extends Entity {
    constructor(team: team) {
      super();
      this.type = 'thor';
      this.team = team;
    }
  }

  export class Troll extends Entity {
    constructor(team: team) {
      super();
      this.type = 'troll';
      this.team = team;
    }
  }

  export class Vampire extends Entity {
    constructor(team: team) {
      super();
      this.type = 'vampire';
      this.team = team;
    }
  }

export class Viking extends Entity {
  constructor(team: team) {
    super();
    this.type = 'viking';
    this.team = team;
  }
}

export class Wizard extends Entity {
  constructor(team: team) {
    super();
    this.type = 'wizard';
    this.team = team;
  }
}
