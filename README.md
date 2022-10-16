# nitrox-lab-core

![npm](https://img.shields.io/npm/v/nitrox-lab-core)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/KG32/nitrox-lab-core/Node.js%20CI?label=tests)

## Usage

```bash
npm i nitrox-lab-core
```

```js
import { NitroxLabCore } from 'nitrox-lab-core';

const nx = new NitroxLabCore();

const mod = nx.calcMOD(0.32, 1.4); // 33.75
```

### Settings

- settings (optional)
  - units (optional) - depth and pressure units (METRIC | IMPERIAL), default: METRIC
  - defaultPpO2Max (optional) - default maximum $O_{2}$ fraction, default: 1.4

```js
    import { NitroxLabCore, Units } from 'nitrox-lab-core';

    const settings = {
        units: Units.METRIC, // optional, METRIC | IMPERIAL
        defaultPpO2Max: 1.4 // optional
    };
    const nx = new NitroxLabCore(settings);
```

### MOD

```calcMOD(fO2, ppO2Max);```

- fO2 - $O_{2}$ fraction
- ppO2Max - maximum $O_{2}$ partial pressure

```js
    const mod = nx.calcMOD(0.32, 1.4); // 33.75
```


### Best mix

```calcBestMix(depth, ppO2Max);```

- depth
- ppO2Max - maximum $O_{2}$ partial pressure

```js
    const bestMix = nx.calcBestMix(30, 1.4); // 0.35
```

### Top off

```calcTopOff(options);```

- options
  - currentMix
    - fO2 - current mix $O_{2}$ fraction
    - p - pressure
  - topOffMix
    - fO2 - top off mix $O_{2}$ fraction
- targetPressure - end pressure

```js
const options = {
    currentMix: {
        fO2: 0.32,
        p: 100
    },
    topOffMix: {
        fO2: 0.21
    },
    targetPressure: 220
};

const topOffResult = nx.calcTopOff(options); // 0.26
```
