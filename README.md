
# project startkit

local 開發工具包
使用 gulp管理執行任務 及用 gulp stream 透過 webpack bundle .js .vue ...

###  run script

```
$ yarn || yarn install // install packages in first time
```
```
$ gulp || gulp dev  //  build dev files & watch file change
```
```
$ gulp build // build production files
```

### 情境說明

- LOCALHOST開發僅能餵假資料  CALL DEV 可上自己的TEST DOMAIN
- 透過CMS系統 上傳活動代號.zip 壓縮 `gulp build`後產生的 monopoly 資料夾
- API切換 可透過 `FixedHost.js` 更換 env user達成想呼叫的api網址
- API `FixedHost.js`  env > `PROD` `DEV` `STAGE`

###  配置及相關食譜 (此專案dist變更為monopoly)

- html : src/template的 .html 會被 copy to dist/
- less : src/styles 的 .less 會被compile to dist/styles/ 
  * 建議參考站上進行配置  或參考sass的 7-1 pattern  
- assets : src/assets copy to dist/assets
- script :  src/scripts 下為entry point  webpack bundle to dist/scripts & watch 