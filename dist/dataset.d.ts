export default class Dataset {
    label: String;
    data: Array<Number>;
    color: String;
    id: String | number;
    constructor(id: any);
    get(): this;
    addPoint(value: Number): void;
    setColor(color: any): void;
}
