export class RnDate extends Date {
  constructor(dateString?: string) {
    if (dateString === undefined || dateString === null) {
      super();
    } else {
      let dateParam = dateString.split(/[\s-:]/);
      if (dateParam.length > 3) {
        dateParam[1] = (parseInt(dateParam[1], 10) - 1).toString();
        super(...(dateParam as []));
      } else {
        super(dateString);
      }
    }
  }
}
