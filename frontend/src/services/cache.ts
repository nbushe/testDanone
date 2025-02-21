import { SensorData } from "../misc/SensorData"

// Тип для кэша (словарь: ключ-строка → массив SensorData)
export type SensorsCache = Record<string, SensorData[]>;

// Хелперы для работы с кэшем
export const cacheHelpers = {
    /**
     * Преобразует кэш в массив массивов SensorData
     */
    toArray: (cache: SensorsCache): SensorData[][] => Object.values(cache),

    /**
     * Аналог Array.map для кэша
     */
    map: <T>(
        cache: SensorsCache,
        callback: (data: SensorData[], key: string) => T
    ): T[] => Object.entries(cache).map(([key, data]) => callback(data, key)),

    /**
     * Аналог Array.forEach для кэша
     */
    forEach: (
        cache: SensorsCache,
        callback: (data: SensorData[], key: string) => void
    ): void => Object.entries(cache).forEach(([key, data]) => callback(data, key)),

    /**
     * Фильтрация кэша по предикату
     */
    filter: (
        cache: SensorsCache,
        predicate: (data: SensorData[], key: string) => boolean
    ): SensorsCache => Object.fromEntries(
        Object.entries(cache).filter(([key, data]) => predicate(data, key))
    ),

    /**
     * Количество временных меток в кэше
     */
    length: (cache: SensorsCache): number => Object.keys(cache).length,

    /**
     * Добавляет новые данные в кэш с группировкой по TimeStamp
     */
    addData: (cache: SensorsCache, newData: SensorData[]): SensorsCache => {
        // Группируем новые данные, исключая дубликаты
        const groupedNewData = newData.reduce<Record<string, SensorData[]>>(
            (acc, item) => {
                const key = item.TimeStamp;

                // 1. Проверяем существующие данные в кэше
                const existingInCache = cache[key] || [];

                // 2. Проверяем дубликаты по id
                const isDuplicate = existingInCache.some(cachedItem => {
                    const newIds = item.Sensors.map(s => s.Id)
                    const oldIds = cachedItem.Sensors.map(s => s.Id)

                    // Если нет одинаковых id, возвращаем false
                    return newIds.some(id => oldIds.includes(id))
                }
                );

                // 3. Добавляем только если нет дубликата
                if (!isDuplicate) {
                    acc[key] = [...(acc[key] || []), item];
                }

                return acc;
            },
            {}
        );

        // Объединяем с существующим кэшем
        return Object.entries(groupedNewData).reduce<SensorsCache>(
            (newCache, [timestamp, data]) => ({
                ...newCache,
                [timestamp]: [...(newCache[timestamp] || []), ...data]
            }),
            { ...cache } // Исходный кэш остается неизменным
        );
    },
    /**
     * Получает подмножество кэша для указанного временного диапазона [start, end]
     */
    getRange: (
        cache: SensorsCache,
        start: string,
        end: string
    ): SensorsCache => {
        const startTime = new Date(start).getTime();
        const endTime = new Date(end).getTime();

        const Entries = Object.entries(cache);

        return Entries.reduce<SensorsCache>(
            (acc, [timestamp, data]) => {
                const currentTime = new Date(timestamp).getTime();
                // console.log(`Current : ${currentTime}`);

                return currentTime >= startTime && currentTime <= endTime
                    ? { ...acc, [timestamp]: data }
                    : acc;
            }, {}
        );
    },

    /**
     * Возвращает первый массив SensorData[] из кэша (в хронологическом порядке).
     * Если кэш пуст или не найден подходящий массив, возвращает пустой массив.
     * @param predicate Опциональный фильтр для элементов массива
     */
    firstOrDefault: (
        cache: SensorsCache,
        predicate?: (data: SensorData) => boolean
    ): SensorData[] => {
        // 1. Получаем отсортированные по времени ключи
        const sortedKeys = Object.keys(cache)
            .map(key => new Date(key))
            .sort((a, b) => a.getTime() - b.getTime())
            .map(date => date.toISOString());

        // 2. Ищем первый подходящий массив
        for (const key of sortedKeys) {
            const items = cache[key] || [];

            // Если предикат не задан, возвращаем первый массив
            if (!predicate) {
                return items;
            }

            // Иначе ищем первый массив, содержащий хотя бы один подходящий элемент
            const filtered = items.filter(predicate);
            if (filtered.length > 0) {
                return filtered;
            }
        }

        // 3. Если ничего не найдено
        return [];
    },

};