
LabelColor Expo Project - 微信小程序简洁风 (Style 1)
==================================================

包含文件:
- App.js (主应用原型)
- package.json
- app.json
- eas.json (EAS 构建配置)
- assets/color_database_200_sample.json (200色示例库)

如何运行 (手机/电脑均可):
1) 安装 Expo Go 应用到手机 (Play商店 / App Store)
2) 将此工程上传到 GitHub 或在本地使用 'expo start' 启动
3) 若要云构建 APK: 使用 EAS 构建 (eas build -p android --profile production)
   - 在 expo.dev 创建账号, 生成 Access Token, 在 GitHub Secrets 添加 EAS_TOKEN
   - 或在 Termux 中使用 eas-cli 登录并触发构建
注意:
- 拍照识色、语音识别、Pantone 精确匹配、PDF导出为占位，需要集成原生模块或第三方服务。
- 颜色库已内置 (assets/color_database_200_sample.json)，可离线使用.
