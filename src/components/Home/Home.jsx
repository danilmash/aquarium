import { useState, useEffect, useCallback } from 'react';
import { v4 } from 'uuid';
import './Home.css';
import { check, getFishType } from '../../utils';
import data from '../../data/tasks.json';
import { compatibilityMap } from '../../data/fishes.json';
import { FishSelect, Loader } from '..';
import { Aquarium } from '../Aquarium';
import { fishesMap } from '../../utils/getFishType';

const { tasks } = data;

// Функция для получения русского названия рыбы по внутреннему типу
const getRussianFishName = (type) => {
  const reverseMap = Object.entries(fishesMap).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});
  return reverseMap[type] || type;
};

// Функция для формирования итогового состояния аквариума с дефолтами
const getFinalAquarium = (taskAquarium = {}) => ({
  type: taskAquarium.type ?? 'стандартный',
  plants: taskAquarium.plants ?? [],
  fish: taskAquarium.fish ?? [],
  temperature: typeof taskAquarium.temperature === 'number' ? taskAquarium.temperature : null,
  ph: typeof taskAquarium.ph === 'number' ? taskAquarium.ph : null,
  size: taskAquarium.size ?? {},
  oxygenLevel: typeof taskAquarium.oxygenLevel === 'number' ? taskAquarium.oxygenLevel : null,
  hardness: typeof taskAquarium.hardness === 'number' ? taskAquarium.hardness : null,
  kh: typeof taskAquarium.kh === 'number' ? taskAquarium.kh : null,
  nitrateLevel: typeof taskAquarium.nitrateLevel === 'number' ? taskAquarium.nitrateLevel : null,
  lightIntensity: typeof taskAquarium.lightIntensity === 'number' ? taskAquarium.lightIntensity : 100,
  decorations: taskAquarium.decorations ?? [],
  filters: taskAquarium.filters ?? [],
  substrate: taskAquarium.substrate ?? null,
  feeding: taskAquarium.feeding ?? [],
  feedingSchedule: taskAquarium.feedingSchedule ?? [],
  fertilizer: taskAquarium.fertilizer ?? null,
  shape: taskAquarium.shape ?? 'стандартный'
});

// Основной компонент приложения
export const Home = () => {
  const [level, setLevel] = useState(2);

  const [code, setCode] = useState('');
  const [aquarium, setAquarium] = useState({});

  const [fishes, setFishes] = useState([]);

  const [task, setTask] = useState({});
  const [output, setOutput] = useState('');

  const [history, setHistory] = useState([]); // Массив для хранения истории состояний
  const [historyIndex, setHistoryIndex] = useState(-1); // Текущий индекс в истории

  const onRemoveFish = useCallback((id) => {
    setFishes((prev) => {
      const updatedFishes = prev.filter((item) => item.id !== id);
      // Обновляем параметры аквариума при удалении рыбки
      const removedFish = prev.find(fish => fish.id === id);
      if (removedFish) {
        setAquarium(prevAquarium => {
          const russianFishName = getRussianFishName(removedFish.type);
          const updatedFish = prevAquarium.fish.filter(
            fishName => fishName !== russianFishName
          );
          return {
            ...prevAquarium,
            fish: updatedFish
          };
        });
      }
      return updatedFishes;
    });
  }, []);

  // Функция для выполнения JavaScript кода
  const runCode = () => {
    try {
      // Очищаем вывод
      setOutput('');

      // Создаем копию текущего аквариума с начальными значениями
      const newAquarium = getFinalAquarium(task.aquarium);

      // Сохраняем начальную рыбку (сома)
      const initialFish = newAquarium.fish.find(fish => fish === 'сом');
      // Очищаем массив рыб в аквариуме, но сохраняем сома если он был
      newAquarium.fish = initialFish ? [initialFish] : [];

      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({ aquarium: { ...aquarium }, code, output });
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      // Создаем безопасный контекст выполнения
      const context = {
        // Базовые функции для работы с аквариумом
        setAquariumType: (type) => {
          newAquarium.type = type;
          return `Тип аквариума изменен на: ${type}`;
        },
        addPlant: (plant, count = 1) => {
          if (!newAquarium.plants) newAquarium.plants = [];
          // Добавляем указанное количество растений
          const plantsToAdd = Array(count).fill(plant);
          newAquarium.plants = [...newAquarium.plants, ...plantsToAdd];
          return `Добавлено ${count} ${plant}${count > 1 ? 'а' : ''}`;
        },
        removePlant: (plant) => {
          if (!newAquarium.plants) newAquarium.plants = [];
          newAquarium.plants = newAquarium.plants.filter((p) => p !== plant);
          return `Удалено растение: ${plant}`;
        },
        addFish: (fish) => {
          newAquarium.fish.push(fish);
          setFishes((prev) => [...prev, { type: getFishType(fish), id: v4() }]);
          return `Добавлена рыба: ${fish}`;
        },
        setTemperature: (temp) => {
          newAquarium.temperature = temp;
          return `Установлена температура: ${temp}°C`;
        },
        setPH: (ph) => {
          newAquarium.ph = ph;
          return `Установлен pH: ${ph}`;
        },
        checkCompatibility: (fish1, fish2) => {
          const compatible = compatibilityMap[fish1]?.includes(fish2) || compatibilityMap[fish2]?.includes(fish1);
          return `Рыбы ${fish1} и ${fish2} ${compatible ? 'совместимы' : 'несовместимы'}`;
        },

        // Новые функции для параметров воды
        setOxygenLevel: (level) => {
          newAquarium.oxygenLevel = level;
          return `Уровень кислорода установлен на: ${level} мг/л`;
        },
        setHardness: (level) => {
          newAquarium.hardness = level;
          return `Жесткость воды установлена на: ${level}°dH`;
        },
        setCarbonateHardness: (level) => {
          newAquarium.kh = level;
          return `Карбонатная жесткость установлена на: ${level}°dKH`;
        },
        setNitrateLevel: (level) => {
          newAquarium.nitrateLevel = level;
          return `Уровень нитратов установлен на: ${level} мг/л`;
        },
        setLight: (intensity) => {
          newAquarium.lightIntensity = intensity;
          return `Интенсивность освещения установлена на: ${intensity}%`;
        },

        // Функции для декора и оборудования
        addDecoration: (type) => {
          if (!newAquarium.decorations) newAquarium.decorations = [];
          newAquarium.decorations.push(type);
          return `Добавлен декор: ${type}`;
        },
        addFilter: (type) => {
          if (!newAquarium.filters) newAquarium.filters = [];
          newAquarium.filters.push(type);
          return `Добавлен фильтр: ${type}`;
        },
        setSubstrate: (type, depth) => {
          newAquarium.substrate = { type, depth };
          return `Установлен грунт: ${type}, толщина: ${depth} см`;
        },

        // Функции для кормления
        addFood: (type, amount) => {
          if (!newAquarium.feeding) newAquarium.feeding = [];
          newAquarium.feeding.push({ type, amount });
          return `Добавлен корм: ${type}, количество: ${amount}`;
        },
        setFeedingSchedule: (times) => {
          newAquarium.feedingSchedule = times;
          return `Установлено расписание кормления: ${times.join(', ')}`;
        },

        // Функции мониторинга
        getFishCount: () => {
          return `Количество рыб: ${newAquarium.fish.length}`;
        },
        getWaterParameters: () => {
          return {
            temperature: newAquarium.temperature,
            ph: newAquarium.ph,
            oxygen: newAquarium.oxygenLevel,
            hardness: newAquarium.hardness,
            kh: newAquarium.kh,
            nitrate: newAquarium.nitrateLevel
          };
        },

        // Функции для растений
        trimPlant: (plantName) => {
          if (newAquarium.plants.includes(plantName)) {
            return `Растение ${plantName} подрезано`;
          }
          return `Растение ${plantName} не найдено`;
        },
        fertilizePlants: (type) => {
          newAquarium.fertilizer = type;
          return `Добавлено удобрение: ${type}`;
        },

        // Функции для размеров аквариума
        setAquariumSize: (length, width, height) => {
          newAquarium.size = { length, width, height };
          return `Установлены размеры аквариума: ${length}x${width}x${height} см`;
        },
        setAquariumShape: (shape) => {
          newAquarium.shape = shape;
          return `Установлена форма аквариума: ${shape}`;
        },
        calculateVolume: () => {
          const { length, width, height } = newAquarium.size || {};
          if (length && width && height) {
            const volume = (length * width * height) / 1000; // перевод в литры
            return `Объем аквариума: ${volume} литров`;
          }
          return 'Невозможно рассчитать объем: не заданы размеры';
        },

        // Вывод в консоль
        console: {
          log: (message) => {
            setOutput((prev) => prev + message + '\n');
            return message;
          }
        }
      };

      // Создаем безопасную функцию для выполнения кода
      const safeEval = (code) => {
        const fn = new Function(
          ...Object.keys(context),
          `"use strict";
          try {
            ${code}
          } catch (error) {
            console.log("Ошибка: " + error.message);
          }`
        );
        return fn(...Object.values(context));
      };

      // Выполняем код
      safeEval(code);

      // Обновляем аквариум
      setAquarium(newAquarium);
      // Обновляем список рыбок, сохраняя начальную рыбку
      const fishesToSet = newAquarium.fish.map(fish => ({ type: getFishType(fish), id: v4() }));
      setFishes(fishesToSet);

      // Проверяем задание
      if (check(task, newAquarium)) {
        setOutput((prev) => prev + '\nОтлично! Задание выполнено успешно!');
        setTask((prev) => ({ ...prev, isValid: true }));
      } else if (task.validation) {
        setOutput((prev) => prev + '\nПока не совсем правильно. Попробуй еще раз!');
      }
    } catch (error) {
      setOutput(`Ошибка: ${error.message}`);
    }
  };

  // Функция для перехода к следующему уровню
  const nextLevel = () => {
    setLevel((prev) => prev + 1);
  };

  // Функция для перехода к предыдущему уровню
  const prevLevel = () => {
    if (level > 1) {
      setLevel((prev) => prev - 1);
    }
  };

  const onClickFishButton = (value) => {
    setCode((prev) => prev + `\naddFish("${value}");`);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setAquarium(prevState.aquarium);
      setCode(prevState.code);
      setOutput(prevState.output);
      setHistoryIndex(historyIndex - 1);

      // Также сбрасываем статус выполнения задания
      setTask((prev) => ({ ...prev, isValid: false }));
    }
  };

  const loadTask = useCallback(() => {
    const initialTask = tasks.find((t) => t.id === level) || tasks[0];
    setTask(initialTask);
    setCode(initialTask.initialCode);
    const finalAquarium = getFinalAquarium(initialTask.aquarium);
    setAquarium(finalAquarium);
    setFishes((finalAquarium.fish || []).map((item) => ({ type: getFishType(item), id: v4() })));
  }, [level]);

  useEffect(() => {
    loadTask();
  }, [level, loadTask]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [historyIndex, undo]);

  if (!Object.keys(aquarium).length || !Object.keys(task).length) {
    return <Loader />;
  }
  return (
    <div className="container">
      <header className="header">
        <h1 className="title">АквариумJS</h1>
      </header>

      <div className="app-layout">
        {/* Объединенная панель с заданием и кодом */}
        <div className="combined-panel">
          <div className="task-section">
            <h2 className="panel-title">
              Задание {task.id}: {task.title}
            </h2>
            <p className="task-description">{task.description}</p>
            <div className="hint-box">
              <h3 className="hint-title">Подсказка:</h3>
              <p className="hint-text">{task.hint}</p>
            </div>
          </div>

          <div className="code-section">
            <h2 className="panel-title">Код на JavaScript</h2>
            <textarea className="code-editor" value={code} onChange={(e) => setCode(e.target.value)} />
            <div className="button-group">
              <button className="button button-run" onClick={runCode}>
                Запустить код
              </button>
              <button className="button button-undo" onClick={undo} disabled={historyIndex <= 0}>
                Отменить (Ctrl+Z)
              </button>
            </div>

            <div className="output-container">
              <h3 className="output-title">Вывод программы:</h3>
              <pre className="output-display">{output || 'Нажмите "Запустить код", чтобы увидеть результат'}</pre>
            </div>

            <div className="navigation-buttons">
              <button className="button button-prev" onClick={prevLevel} disabled={level === 1}>
                ← Предыдущее
              </button>
              <button className="button button-next" onClick={nextLevel} disabled={!task.isValid}>
                Следующее →
              </button>
            </div>
          </div>
        </div>

        {/* Правая панель с визуализацией */}
        <div className="aquarium-panel">
          <h2 className="panel-title">Аквариум</h2>
          <Aquarium
            level={level}
            propFish={fishes}
            type={aquarium.type}
            onRemoveFish={onRemoveFish}
            // Новые параметры
            oxygenLevel={aquarium.oxygenLevel}
            hardness={aquarium.hardness}
            kh={aquarium.kh}
            nitrateLevel={aquarium.nitrateLevel}
            lightIntensity={aquarium.lightIntensity}
            decorations={aquarium.decorations}
            filters={aquarium.filters}
            substrate={aquarium.substrate}
            feeding={aquarium.feeding}
            feedingSchedule={aquarium.feedingSchedule}
            fertilizer={aquarium.fertilizer}
            size={aquarium.size}
            shape={aquarium.shape}
            plants={aquarium.plants}
          />

          <div className="aquarium-params">
            <h3 className="params-title">Параметры аквариума:</h3>
            <ul className="params-list">
              <li>
                <strong>Тип:</strong> {aquarium.type || '-'}
              </li>
              <li>
                <strong>Температура:</strong> {typeof aquarium.temperature === 'number' && !isNaN(aquarium.temperature) ? aquarium.temperature + '°C' : '-'}
              </li>
              <li>
                <strong>pH:</strong> {typeof aquarium.ph === 'number' && !isNaN(aquarium.ph) ? aquarium.ph : '-'}
              </li>
              <li>
                <strong>Кислород:</strong> {typeof aquarium.oxygenLevel === 'number' && !isNaN(aquarium.oxygenLevel) ? aquarium.oxygenLevel + ' мг/л' : '-'}
              </li>
              <li>
                <strong>Жесткость:</strong> {typeof aquarium.hardness === 'number' && !isNaN(aquarium.hardness) ? aquarium.hardness + '°dH' : '-'}
              </li>
              <li>
                <strong>Карбонатная жесткость:</strong> {typeof aquarium.kh === 'number' && !isNaN(aquarium.kh) ? aquarium.kh + '°dKH' : '-'}
              </li>
              <li>
                <strong>Нитраты:</strong> {typeof aquarium.nitrateLevel === 'number' && !isNaN(aquarium.nitrateLevel) ? aquarium.nitrateLevel + ' мг/л' : '-'}
              </li>
              <li>
                <strong>Освещение:</strong> {typeof aquarium.lightIntensity === 'number' && !isNaN(aquarium.lightIntensity) ? aquarium.lightIntensity + '%' : '-'}
              </li>
              <li>
                <strong>Грунт:</strong> {aquarium.substrate ? `${aquarium.substrate.type} (${aquarium.substrate.depth} см)` : 'не установлен'}
              </li>
              <li>
                <strong>Декорации:</strong> {aquarium.decorations?.length ? aquarium.decorations.join(', ') : 'нет'}
              </li>
              <li>
                <strong>Фильтры:</strong> {aquarium.filters?.length ? aquarium.filters.join(', ') : 'нет'}
              </li>
              <li>
                <strong>Растения:</strong> {aquarium.plants?.length ? aquarium.plants.join(', ') : '-'}
              </li>
              <li>
                <strong>Рыбы:</strong> {aquarium.fish?.length ? aquarium.fish.join(', ') : '-'}
              </li>
              {(aquarium.size && typeof aquarium.size.length === 'number' && typeof aquarium.size.width === 'number' && typeof aquarium.size.height === 'number' && !isNaN(aquarium.size.length) && !isNaN(aquarium.size.width) && !isNaN(aquarium.size.height)) ? (
                <li>
                  <strong>Размеры:</strong> {aquarium.size.length}x{aquarium.size.width}x{aquarium.size.height} см
                </li>
              ) : null}
              {aquarium.shape && (
                <li>
                  <strong>Форма:</strong> {aquarium.shape}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
