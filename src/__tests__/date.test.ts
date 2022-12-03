import { RnDate } from "../date";

describe("RnDate", () => {

  describe("Date without hour, minutes, seconds", () => {
    it("should work with getFullYear, getMonth and getDate", () => {
      expect(new RnDate("2022-01-01").getFullYear()).toBe(2022);
      expect(new RnDate("2022-01-01").getMonth()).toBe(0);
      expect(new RnDate("2022-01-01").getDate()).toBe(1)
    });

    it("should work equal as date", () => {
      expect(new RnDate("2022-01-01")).toEqual(new Date("2022-01-01"));
    })
  
    it("should work with to iso string", () => {
      expect(new RnDate("2022-01-01").toISOString()).toBe(new Date("2022-01-01").toISOString());
    });
  
    it("should work with to date string", () => {
      expect(new RnDate("2022-01-01").toDateString()).toBe(new Date("2022-01-01").toDateString());
    })
  
    it("should work with getTime ", () => {
      expect(new RnDate("2022-01-01").getTime()).toEqual(new Date("2022-01-01").getTime());
    })
  })
  
  describe("Date with hour, minutes, seconds", () => {
    it("should work with getFullYear, getMonth and getDate", () => {
      expect(new RnDate("2022-01-01 17:04:03").getFullYear()).toBe(2022);
      expect(new RnDate("2022-01-01 17:04:03").getMonth()).toBe(0);
      expect(new RnDate("2022-01-01 17:04:03").getDate()).toBe(1)
    });

    it("should work equal as date", () => {
      expect(new RnDate("2022-01-01 17:04:03")).toEqual(new Date("2022-01-01 17:04:03"));
    })
  
    it("should work with to iso string", () => {
      expect(new RnDate("2022-01-01 17:04:03").toISOString()).toBe(new Date("2022-01-01 17:04:03").toISOString());

    });
  
    it("should work with to date string", () => {
      expect(new RnDate("2022-01-01 17:04:03").toDateString()).toBe(new Date("2022-01-01 17:04:03").toDateString());
    })
  
    it("should work with getTime ", () => {
      expect(new RnDate("2022-01-01 17:04:03").getTime()).toEqual(new Date("2022-01-01 17:04:03").getTime());
    })
  })

})