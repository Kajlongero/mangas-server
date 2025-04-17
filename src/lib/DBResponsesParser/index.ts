export class DBResponsesParser {
  private static instance: DBResponsesParser;
  private memo: Map<string, string>;

  private constructor() {
    this.memo = new Map<string, string>();
  }

  public static getInstance() {
    if (!DBResponsesParser.instance) {
      this.instance = new DBResponsesParser();

      return this.instance;
    }

    return this.instance;
  }

  public parse(obj: Record<string, unknown>) {
    const newObj: Record<string, unknown> = {};

    for (const [key, val] of Object.entries(obj)) {
      let word: string = key;

      const parsed = this.transform(word);

      if (typeof Date.parse(val as unknown as string) === "number") {
        newObj[parsed] = val;
        continue;
      }

      if (!Array.isArray(val) && val !== null && typeof val === "object") {
        newObj[parsed] = this.parse(val as Record<string, unknown>);
        continue;
      }

      newObj[parsed] = val;
    }
    return newObj;
  }

  private transform(str: string): string {
    if (this.memo.has(str)) {
      return this.memo.get(str) as string;
    }

    const split = str.split("_");
    if (split.length < 2) return str;

    let field = "";

    split.map((elem, index) => {
      if (index === 0) {
        field += elem;
      } else {
        const firstLetter = elem[0].toUpperCase();
        const word = elem.substring(1, elem.length);
        const parsed = `${firstLetter}${word}`;

        field += parsed;
      }
    });

    this.memo.set(str, field);

    return field;
  }
}
