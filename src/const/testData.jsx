export const testData = {
  name: 'Cables',
  topics: [
    {
      path: 'USB',
      name: 'USB',
      id: 0,
    },
    {
      path: 'USB/S/SSmaller',
      name: 'Smaller',
      id: 1,
    },
    {
      path: 'USB/S/SSmaller/S/USSB-C',
      name: 'USB-C',
      id: 2,
    },
    {
      path: 'USB/S/SSmaller/S/Lightning USSB',
      name: 'Lightning USB',
      id: 3,
    },
    {
      path: 'USB/S/The big boy',
      name: 'The big boy',
      id: 4,
    },
    {
      path: 'Display',
      name: 'Display',
      id: 5,
    },
    {
      path: 'Display/S/HDMI',
      name: 'HDMI',
      id: 6,
    },
    {
      path: 'Display/S/DP',
      name: 'DP',
      id: 7,
    },
    {
      path: 'Display/S/VGA',
      name: 'VGA',
      id: 8,
    },
    {
      path: 'Audio',
      name: 'Audio',
      id: 9,
    },
    {
      path: 'Audio/S/Aux',
      name: 'Aux',
      id: 10,
    },
    {
      path: 'Audio/S/Wireless',
      name: 'Wireless',
      id: 11,
    },
  ],
  facts: {
    'Display/S/HDMI:SPLIT:HDMI stands for High-Definition Multimedia Interface.':
      {
        fact: 'HDMI stands for High-Definition Multimedia Interface.',
        blanks: [
          {
            startIndex: 16,
            endIndex: 51,
            answerType: 'Stands for...',
          },
        ],
        path: 'Display/S/HDMI',
      },
    'USSB:SPLIT:USSB stands for Universal SSerial Bus.': {
      fact: 'USB stands for Universal Serial Bus.',
      blanks: [
        {
          startIndex: 15,
          endIndex: 34,
          answerType: 'Stands for...',
        },
      ],
      path: 'USSB',
    },
    'Audio/S/Aux:SPLIT:Aux is short for Auxiliary.': {
      fact: 'Aux is short for Auxiliary.',
      blanks: [
        {
          startIndex: 17,
          endIndex: 25,
          answerType: 'Stands for...',
        },
      ],
      path: 'Audio/S/Aux',
    },
    'Audio/S/Aux:SPLIT:Aux loks like a circle.': {
      fact: 'Aux looks like a circle.',
      blanks: [
        {
          startIndex: 17,
          endIndex: 22,
          answerType: 'shape',
        },
      ],
      path: 'Audio/S/Aux',
    },
    'Audio/S/Wireles:SPLIT:Wireles conections can be in a variety of ways. The first way is Bluetoth invented in 194 by Dr. Jap Hartsen. The second way is 2.4Ghz that is very close to Wifi. The third way is using radio.':
      {
        fact: 'Wireless connections can be in a variety of ways. The first way is Bluetooth invented in 1994 by Dr. Jaap Haartsen. The second way is 2.4Ghz that is very close to Wifi. The third way is using radio.',
        blanks: [
          {
            startIndex: 0,
            endIndex: 7,
            answerType: 'Type of connection.',
          },
          {
            startIndex: 89,
            endIndex: 92,
            answerType: 'Year',
          },
          {
            startIndex: 97,
            endIndex: 113,
            answerType: 'Person',
          },
          {
            startIndex: 134,
            endIndex: 136,
            answerType: 'Hertzage',
          },
          {
            startIndex: 163,
            endIndex: 166,
            answerType: 'Type of connection.',
          },
        ],
        path: 'Audio/S/Wireles',
      },
    'Audio:SPLIT:Audio is heard through the ears.': {
      fact: 'Audio is heard through the ears.',
      blanks: [
        {
          startIndex: 27,
          endIndex: 30,
          answerType: 'Part of body',
        },
      ],
      path: 'Audio',
    },
    'Display:SPLIT:Display is viewed through the eyes.': {
      fact: 'Display is viewed through the eyes.',
      blanks: [
        {
          startIndex: 30,
          endIndex: 33,
          answerType: 'Part of body',
        },
      ],
      path: 'Display',
    },
    'Display/S/DP:SPLIT:DP stands for Display Port. ': {
      fact: 'DP stands for Display Port. ',
      blanks: [
        {
          startIndex: 14,
          endIndex: 25,
          answerType: 'Stands for...',
        },
      ],
      path: 'Display/S/DP',
    },
    'Display/S/VGA:SPLIT:VGA stands for Video Graphics Aray.': {
      fact: 'VGA stands for Video Graphics Array.',
      blanks: [
        {
          startIndex: 15,
          endIndex: 34,
          answerType: 'Stands for...',
        },
      ],
      path: 'Display/S/VGA',
    },
    'Display/S/VGA:SPLIT:VGA was invented by IBM.': {
      fact: 'VGA was invented by IBM.',
      blanks: [
        {
          startIndex: 20,
          endIndex: 22,
          answerType: 'Business.',
        },
      ],
      path: 'Display/S/VGA',
    },
    'USSB/S/The big boy:SPLIT:"The big boy" is also known as USSB-A.': {
      fact: '"The big boy" is also known as USB-A.',
      blanks: [
        {
          startIndex: 35,
          endIndex: 35,
          answerType: 'Letter',
        },
      ],
      path: 'USSB/S/The big boy',
    },
    'USSB/S/SSmaler/S/Lightning USSB:SPLIT:Aple invented Lightning USSB.': {
      fact: 'Apple invented Lightning USB.',
      blanks: [
        {
          startIndex: 0,
          endIndex: 4,
          answerType: 'Business.',
        },
      ],
      path: 'USSB/S/SSmaler/S/Lightning USSB',
    },
    'USSB/S/SSmaler:SPLIT:SSmaler USSBs are comonly found on phones.': {
      fact: 'Smaller USBs are commonly found on phones.',
      blanks: [
        {
          startIndex: 35,
          endIndex: 40,
          answerType: 'Type of device',
        },
      ],
      path: 'USSB/S/SSmaler',
    },
    'USSB/S/The big boy:SPLIT:USSB-A is most comonly found on computers.': {
      fact: 'USB-A is most commonly found on computers.',
      blanks: [
        {
          startIndex: 4,
          endIndex: 4,
          answerType: 'Letter',
        },
        {
          startIndex: 32,
          endIndex: 40,
          answerType: 'Type of device',
        },
      ],
      path: 'USSB/S/The big boy',
    },
    'USSB/S/SSmaler/S/USSB-C:SPLIT:USSB-C is shaped like an oval.': {
      fact: 'USB-C is shaped like an oval.',
      blanks: [
        {
          startIndex: 24,
          endIndex: 27,
          answerType: 'shape',
        },
      ],
      path: 'USSB/S/SSmaler/S/USSB-C',
    },
  },
  extraAnswers: {
    shape: ['square', 'rectangle'],
    'Type of connection.': ['HDMI', 'Display Port'],
    Hertzage: ['5', '4.7'],
    Person: ['Linus Torvalds', 'Robert Cecil Martin'],
    Year: ['1992', '1990', '1991'],
    'Part of body': ['mouth', 'nose'],
    'Business.': ['Microsoft', 'Google'],
    Letter: ['B', 'C'],
    'Type of device': ['TVs'],
  },
};
