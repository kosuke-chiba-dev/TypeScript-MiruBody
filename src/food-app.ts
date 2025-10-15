interface Scoreable {
  readonly totalScore: number;
  render(): void;
}

interface Foodable {
  element: HTMLDivElement;
}

interface Foodsable {
  elements: NodeListOf<HTMLDivElement>;
  activeElements: HTMLDivElement[];
  activeElementsScore: number[];
}

class Score implements Scoreable {
  private constructor() {}
  private static instance: Score;

  get totalScore() {
    const foods = Foods.getInstance();
    return foods.activeElementsScore.reduce((total, score) => total + score, 0);
  }

  render() {
    document.querySelector(".score__number")!.textContent = String(this.totalScore);
  }

  static getInstance() {
    if (!Score.instance) {
      Score.instance = new Score();
    }
    return Score.instance;
  }
}

class Food implements Foodable {
  constructor(public element: HTMLDivElement) {
    element.addEventListener("click", () => {
      element.classList.toggle("food--active");
      const score = Score.getInstance();
      score.render();
    });
  }
}

class Foods implements Foodsable {
  private static instance: Foods;
  private constructor() {
    this.elements.forEach((element) => {
      new Food(element);
    });
  }

  elements = document.querySelectorAll<HTMLDivElement>(".food");
  private _activeElements: HTMLDivElement[] = [];
  private _activeElementsScore: number[] = [];

  get activeElements() {
    this._activeElements = [];
    this.elements.forEach((element) => {
      if (element.classList.contains("food--active")) {
        this._activeElements.push(element);
      }
    });
    return this._activeElements;
  }

  get activeElementsScore() {
    this._activeElementsScore = [];
    this.activeElements.forEach((element) => {
      const score = element.querySelector(".food__score")?.textContent;
      if (score) {
        this._activeElementsScore.push(Number(score));
      }
    });
    return this._activeElementsScore;
  }

  static getInstance() {
    if (!Foods.instance) {
      Foods.instance = new Foods();
    }
    return Foods.instance;
  }
}

const foods = Foods.getInstance();
const score = Score.getInstance();
