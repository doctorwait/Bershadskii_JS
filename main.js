const prompts = require('prompts');
const NUMS = '0123456789.';
const searchName = 'Вячеслав';
const successValidationMsg = 'Привет';
const errorValidationMsg = 'Нет такого имени';

const initial = [
  {
    type: 'toggle',
    name: 'userInitialChoice',
    message:
      'Добро пожаловать в интерфейс тестового задания! Вы хотите начать проверку вводимых значений?',
    initial: true,
    active: 'Да, приступим!',
    inactive: 'Нет',
  },
];

const userInputParser = function (input) {
  if (input.includes(',')) {
    return ['array', input.split(',')];
  }
  for (const sign of input) {
    if (!NUMS.includes(sign)) {
      return ['string', input.trim()];
    }
  }
  return ['num', parseFloat(input)];
};

const questions = function () {
  return [
    {
      type: 'select',
      name: 'inputType',
      message: 'Какой тип данных вы собираетесь проверить?',
      choices: [
        { title: 'Строка', description: 'Здесь разрешены любые символы' },
        { title: 'Число', description: 'Целое или с плавающей точкой' },
        {
          title: 'Массив',
          description: 'Одно или несколько значений, разделённые запятой',
        },
        { title: 'Тип данных? Не очень понимаю, о чём речь...' },
      ],
    },
    {
      type: (prev, values) => (values.inputType === 0 ? 'text' : null),
      name: 'data',
      message: 'Введите текст',
      initial: 'Вячеслав',
      format: input => userInputParser(input),
    },
    {
      type: (prev, values) => (values.inputType === 1 ? 'number' : null),
      name: 'data',
      message: 'Разрешены только числа',
      initial: 0,
      float: true,
    },
    {
      type: (prev, values) => (values.inputType === 2 ? 'list' : null),
      name: 'data',
      message: 'Введите значения через запятую',
      initial: '1, 2',
      format: input => {
        return input.length > 1 ? ['array', input] : userInputParser(input[0]);
      },
    },
  ];
};

const final = [
  {
    type: 'toggle',
    name: 'userFinalChoice',
    message: 'Желаете попробовать ещё раз?',
    initial: true,
    active: 'Вперёд!',
    inactive: 'Пожалуй, с меня хватит...',
  },
];

(async () => {
  const userRowMessage = function (data, type) {
    console.log('Вы ввели: ' + data);
    const resType =
      type === 0
        ? 'строковое выражение'
        : type === 1
        ? 'число'
        : type === 2
        ? 'массив'
        : 'не распознан';
    console.log('Тип данных: ' + resType);
  };

  const stringProcessor = function (row) {
    if (row == searchName) {
      console.log(successValidationMsg + ', ' + searchName);
    } else {
      console.log(errorValidationMsg);
    }
  };

  const numberProcessor = function (num) {
    if (typeof num === 'number' && num > 7) console.log(successValidationMsg);
  };

  const arrayProcessor = function (arr) {
    for (let item of arr) {
      try {
        item = parseFloat(item);
        if (item % 3 === 0) console.log(item);
      } catch (error) {
        continue;
      }
    }
  };

  let condition = (await prompts(initial)).userInitialChoice;

  if (condition) {
    while (condition) {
      const response = await prompts(questions());
      const data = response.data;
      switch (response.inputType) {
        case 0:
        case 2:
          if (data[0] == 'string') {
            userRowMessage(data[1], 0);
            stringProcessor(data[1]);
          } else {
            if (data[0] == 'array') {
              userRowMessage(data[1], 2);
              arrayProcessor(data[1]);
            } else {
              if (data[0] == 'num') {
                userRowMessage(data[1], 1);
                numberProcessor(data[1]);
              }
            }
          }
          break;
        case 1:
          userRowMessage(data, 1);
          numberProcessor(data);
          break;
      }
      condition = (await prompts(final)).userFinalChoice;
    }
  } else {
    return console.log('У вас всегда есть возможность передумать ;)');
  }
  console.log('Благодарим за участие!');
  setTimeout(() => {}, 1500);
})();
