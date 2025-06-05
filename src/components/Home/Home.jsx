import { useState, useEffect, useCallback } from 'react';
import { v4 } from 'uuid';
import './Home.css';
import { check, getFishType } from '../../utils';
import data from '../../data/tasks.json';
import { compatibilityMap } from '../../data/fishes.json';
import { FishSelect, Loader } from '..';
import { Aquarium } from '../Aquarium';

const { tasks } = data;

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
    setFishes((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Функция для выполнения Python кода
  const runCode = () => {
    try {
      // Очищаем вывод
      setOutput('');

      // Создаем копию текущего аквариума
      const newAquarium = { ...aquarium };
      // Очищаем массив рыб в аквариуме
      newAquarium.fish = [];

      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({ aquarium: { ...aquarium }, code, output });
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      // Функции, доступные для использования в коде ученика
      const pythonContext = {
        set_aquarium_type: (type) => {
          newAquarium.type = type;
          return `Тип аквариума изменен на: ${type}`;
        },
        add_plant: (plant) => {
          newAquarium.plants.push(plant);
          return `Добавлено растение: ${plant}`;
        },
        remove_plant: (plant) => {
          newAquarium.plants = newAquarium.plants.filter((p) => p !== plant);
          return `Удалено растение: ${plant}`;
        },
        add_fish: (fish) => {
          newAquarium.fish.push(fish);
          setFishes((prev) => [...prev, { type: getFishType(fish), id: v4() }]);
          return `Добавлена рыба: ${fish}`;
        },
        // удобнее удалять через нажатие на рыбку
        // remove_fish: (fish) => {
        //   newAquarium.fish = newAquarium.fish.filter((f) => f !== fish);
        //   return `Удалена рыба: ${fish}`;
        // },
        set_temperature: (temp) => {
          newAquarium.temperature = temp;
          return `Установлена температура: ${temp}°C`;
        },
        set_ph: (ph) => {
          newAquarium.ph = ph;
          return `Установлен pH: ${ph}`;
        },
        check_compatibility: (fish1, fish2) => {
          const compatible = compatibilityMap[fish1]?.includes(fish2) || compatibilityMap[fish2]?.includes(fish1);

          return `Рыбы ${fish1} и ${fish2} ${compatible ? 'совместимы' : 'несовместимы'}`;
        },
        print: (message) => {
          setOutput((prev) => prev + message + '\n');
          return message;
        },
      };

      // Имитация выполнения Python кода в JavaScript
      // В реальном приложении здесь был бы Python интерпретатор
      const lines = code.split('\n').filter((line) => !line.trim().startsWith('#') && line.trim() !== '');
      let results = [];

      for (const line of lines) {
        if (line.includes('set_aquarium_type')) {
          const match = line.match(/set_aquarium_type\(['"](.+)['"]\)/);
          if (match) results.push(pythonContext.set_aquarium_type(match[1]));
        } else if (line.includes('add_plant')) {
          const match = line.match(/add_plant\(['"](.+)['"]\)/);
          if (match) results.push(pythonContext.add_plant(match[1]));
        } else if (line.includes('remove_plant')) {
          const match = line.match(/remove_plant\(['"](.+)['"]\)/);
          if (match) results.push(pythonContext.remove_plant(match[1]));
        } else if (line.includes('add_fish')) {
          const match = line.match(/add_fish\(['"](.+)['"]\)/);
          if (match) results.push(pythonContext.add_fish(match[1]));
        } else if (line.includes('set_temperature')) {
          const match = line.match(/set_temperature\((\d+(?:\.\d+)?)\)/);
          if (match) results.push(pythonContext.set_temperature(parseFloat(match[1])));
        } else if (line.includes('set_ph')) {
          const match = line.match(/set_ph\((\d+(?:\.\d+)?)\)/);
          if (match) results.push(pythonContext.set_ph(parseFloat(match[1])));
        } else if (line.includes('print')) {
          const match = line.match(/print\(['"](.+)['"]\)/);
          if (match) pythonContext.print(match[1]);
        }
      }

      // Обновляем аквариум
      setAquarium(newAquarium);
      // Обновляем список рыбок в соответствии с аквариумом
      setFishes(newAquarium.fish.map(fish => ({ type: getFishType(fish), id: v4() })));

      // Проверяем задание
      if (check(task, newAquarium)) {
        setOutput((prev) => prev + '\nОтлично! Задание выполнено успешно!');
        setTask((prev) => ({ ...prev, isValid: true }));
      } else if (task.validation) {
        setOutput((prev) => prev + '\nПока не совсем правильно. Попробуй еще раз!');
      }

      // Выводим результаты выполнения
      setOutput((prev) => prev + '\n' + results.join('\n'));
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
    setCode((prev) => prev + `\nadd_fish("${value}")`);
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
    setAquarium(initialTask.aquarium);
    setFishes(initialTask.aquarium.fish.map((item) => ({ type: getFishType(item), id: v4() })));
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
        <h1 className="title">ПитонАквариум</h1>
        <p className="subtitle">Изучаем Python через аквариумистику</p>
      </header>

      <div className="app-layout">
        {/* Левая панель с заданием */}
        <div className="task-panel">
          <h2 className="panel-title">
            Задание {task.id}: {task.title}
          </h2>
          <p className="task-description">{task.description}</p>
          <div className="hint-box">
            <h3 className="hint-title">Подсказка:</h3>
            <p className="hint-text">{task.hint}</p>
            {task.fishSelect && <FishSelect onClickButton={onClickFishButton} />}
            <button className="button button-reset" onClick={loadTask}>
              Сбросить задание
            </button>
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

        {/* Центральная панель с кодом */}
        <div className="code-panel">
          <h2 className="panel-title">Код на Python</h2>
          <textarea className="code-editor" value={code} onChange={(e) => setCode(e.target.value)} />
          <button className="button button-run" onClick={runCode}>
            Запустить код
          </button>
          <button className="button button-undo" onClick={undo} disabled={historyIndex <= 0}>
            Отменить (Ctrl+Z)
          </button>

          <div className="output-container">
            <h3 className="output-title">Вывод программы:</h3>
            <pre className="output-display">{output || 'Нажмите "Запустить код", чтобы увидеть результат'}</pre>
          </div>
        </div>

        {/* Правая панель с визуализацией */}
        <div className="aquarium-panel">
          <h2 className="panel-title">Аквариум</h2>
          <Aquarium level={level} propFish={fishes} type={aquarium.type} onRemoveFish={onRemoveFish} />

          <div className="aquarium-params">
            <h3 className="params-title">Параметры аквариума:</h3>
            <ul className="params-list">
              <li>
                <strong>Тип:</strong> {aquarium.type}
              </li>
              <li>
                <strong>Температура:</strong> {aquarium.temperature}°C
              </li>
              <li>
                <strong>pH:</strong> {aquarium.ph}
              </li>
              <li>
                <strong>Растения:</strong> {aquarium.plants.join(', ')}
              </li>
              <li>
                <strong>Рыбы:</strong> {aquarium.fish.join(', ')}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
