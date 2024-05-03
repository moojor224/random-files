import { logFormatted } from './jstools.js';

describe('logFormatted', () => {
    let consoleLogSpy;

    beforeEach(() => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
    });

    test('should log a number correctly', () => {
        logFormatted(123);
        expect(consoleLogSpy).toHaveBeenCalledWith('123');
    });

    test('should log a boolean correctly', () => {
        logFormatted(true);
        expect(consoleLogSpy).toHaveBeenCalledWith('true');
    });

    test('should log a string correctly', () => {
        logFormatted('test');
        expect(consoleLogSpy).toHaveBeenCalledWith('"test"');
    });

    test('should log an object correctly', () => {
        logFormatted({ key: 'value' });
        expect(consoleLogSpy).toHaveBeenCalledWith('{\n    "key": "value"\n}');
    });

    test('should log a function correctly', () => {
        logFormatted(function test() { return 'test'; });
        expect(consoleLogSpy).toHaveBeenCalledWith('function test() {\n    return "test";\n}');
    });

    test('should respect the maxDepth option', () => {
        const deepObject = { level1: { level2: { level3: 'deep' } } };
        logFormatted(deepObject, { maxDepth: 2 });
        expect(consoleLogSpy).toHaveBeenCalledWith('{\n    "level1": {\n        "level2": "<max depth reached>"\n    }\n}');
    });

    test('should respect the collapsed option', () => {
        logFormatted({ key: 'value' }, { collapsed: true });
        expect(consoleLogSpy).toHaveBeenCalledWith('formatted log', '{\n    "key": "value"\n}');
    });

    test('should respect the label option', () => {
        logFormatted({ key: 'value' }, { label: 'Custom Label' });
        expect(consoleLogSpy).toHaveBeenCalledWith('Custom Label', '{\n    "key": "value"\n}');
    });
});