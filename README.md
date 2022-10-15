# nitrox-lab-core

## Usage

```bash
npm i nitrox-lab-core
```

```js
import { NitroxLabCore } from 'nitrox-lab-core';

const nx = new NitroxLabCore();

const mod = nx.calcMOD(32, 1.4); // 33.75
```

### settings

```js
    import { NitroxLabCore, Units } from 'nitrox-lab-core';

    const options = {
        units: Units.METRIC, // optional, METRIC / IMPERIAL
        defaultPpO2Max: 1.4 // optional
    };
    const nx = new NitroxLabCore(options);
```

### MOD

calcMOD(fO2, ppO2Max)

```js
    const mod = nx.calcMOD(32, 1.4); // 33.75
```
