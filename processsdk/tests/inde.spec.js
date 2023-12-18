import utils from "../src/utils/index.js";

describe("utils.js test", () => {
	test("getType", () => {
		expect(utils.getType({})).toBe("object");
	});

	test("getLength", () => {
		expect(utils.getLength([0, 0], [0, 1])).toBe(1);
	});
});
