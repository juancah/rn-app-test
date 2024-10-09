# Cambios

## Instalar expo-image-picker
Instalalo con este comando:
```
npx expo install expo-image-picker
```
y agregas esta linea a app.json:
```json
{
 "expo":{
    ...
    "plugins": ["expo-image-picker"],
    ...
 },
 ...
}
```
## entry.js:
Crea un archivo llamado `entry.js` en el root de la App con este código.

```javascript
import '@expo/metro-runtime';

import registerRootComponent from 'expo/build/launch/registerRootComponent';

import App from './App';

registerRootComponent(App);
```
el código es casi lo mismo que el código de Expo pero se agregó `expo/metro-runtime` para que haga fast refresh en web.
normalmente se utiliza expo-router en vez de @react-navigation porque funciona mejor con expo y ya tiene esto configurado por default.

## LoginScreen.js:
```javascript

```

## RegisterScreen.js:
```javascript

```