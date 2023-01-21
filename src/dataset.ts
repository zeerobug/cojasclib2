export default class Dataset {
  label: String;
  data: Array<Number>;
  color: String;
  id: String | number;

  constructor(id) {
    this.label = "";
    this.data = [];
    this.id = id;
  }

  get() {
    return this;
  }

  addPoint(value: Number) {
    this.data.push(value);
  }

  setColor(color) {
    this.color = color;
  }
}
