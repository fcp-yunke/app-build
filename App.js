import React, {useState, useEffect} from "react";
import { View, Text, ScrollView, TouchableOpacity, FlatList, SafeAreaView, TextInput, Alert } from "react-native";

/*
  LabelColor - Expo Prototype (WeChat-like simple UI)
  Style: 1 - 微信小程序简洁风
  Notes: Heavy functionality (camera, STT, Pantone DB, PDF export) are placeholders.
  This project is ready to open in Expo / Snack. Color DB is embedded in ./assets/color_database_200_sample.json
*/

import colorDB from "./assets/color_database_200_sample.json";

const MATERIALS = [
  {id:'c1', name:'铜版纸', notes:['吸墨性低','建议光油','注意干燥时间']},
  {id:'c2', name:'合成纸(PP/PET)', notes:['需UV固化','表面处理影响附着']},
  {id:'c3', name:'银龙/镜面', notes:['必打白墨','反光导致测色偏差']},
  {id:'c4', name:'透明PET(需白底)', notes:['白墨厚度建议1-3层','注意套准']},
  {id:'c5', name:'热敏纸', notes:['避免高温','颜色稳定性差']},
  {id:'c6', name:'PVC/膜类', notes:['表面需预处理','防静电']},
];

const TABS = ["调色","色卡","材料","记录","我的"];

export default function App(){
  const [tab, setTab] = useState("调色");
  const [search, setSearch] = useState("");
  const [material, setMaterial] = useState(MATERIALS[0].id);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [colors, setColors] = useState(colorDB.slice(0,200)); // initial 200

  useEffect(()=>{},[]);

  function onPickImage(){ Alert.alert('占位','拍照提色功能需集成相机模块。'); }
  function onStartVoice(){ Alert.alert('占位','语音功能需接入 STT 服务。'); }
  function exportPDF(){ Alert.alert('占位','PDF 导出需后端或原生模块。'); }

  function renderColorItem({item}){
    return (
      <TouchableOpacity onPress={()=>setSelectedColor(item)} style={{width:72, margin:6}}>
        <View style={{height:48, borderRadius:6, backgroundColor: item.RGB.hex, borderWidth:1, borderColor:'#e5e7eb'}} />
        <Text numberOfLines={1} style={{fontSize:11, marginTop:4}}>{item.id}</Text>
        <Text numberOfLines={1} style={{fontSize:10,color:'#666'}}>{Math.round(item.CMYK.C)}% {Math.round(item.CMYK.M)}%</Text>
      </TouchableOpacity>
    );
  }

  function ColorGrid(){
    return (
      <View style={{padding:12}}>
        <View style={{flexDirection:'row', marginBottom:8, alignItems:'center'}}>
          <TextInput value={search} onChangeText={setSearch} placeholder="搜索颜色名 / 编号 / CMYK" style={{flex:1, backgroundColor:'#fff', padding:8, borderRadius:6, borderWidth:1, borderColor:'#eee'}} />
          <TouchableOpacity onPress={()=>{ setSearch(''); }} style={{marginLeft:8, padding:8, backgroundColor:'#007AFF', borderRadius:6}}><Text style={{color:'#fff'}}>清空</Text></TouchableOpacity>
        </View>
        <FlatList
          data={colors.filter(c=> {
            if(!search) return true;
            const s = search.toLowerCase();
            return (c.name && c.name.toLowerCase().includes(s)) || c.id.toLowerCase().includes(s) || (c.CMYK && JSON.stringify(c.CMYK).toLowerCase().includes(s));
          })}
          numColumns={4}
          keyExtractor={item=>item.id}
          renderItem={renderColorItem}
        />
      </View>
    );
  }

  function MaterialPanel(){
    const m = MATERIALS.find(x=>x.id===material);
    return (
      <View style={{padding:12}}>
        <Text style={{fontWeight:'700', marginBottom:8}}>材料选择</Text>
        {MATERIALS.map(it=> (
          <TouchableOpacity key={it.id} onPress={()=>setMaterial(it.id)} style={{padding:10, backgroundColor: material===it.id? '#f3f4f6' : '#fff', borderRadius:8, marginBottom:8, borderWidth:1, borderColor:'#eee'}}>
            <Text style={{fontWeight:'600'}}>{it.name}</Text>
            <Text style={{color:'#666', fontSize:12}}>{it.notes.join('；')}</Text>
          </TouchableOpacity>
        ))}
        <View style={{marginTop:8}}>
          <Text style={{fontWeight:'700'}}>当前材料建议</Text>
          <Text style={{color:'#666', fontSize:13, marginTop:6}}>{m.notes.join('；')}</Text>
        </View>
      </View>
    );
  }

  function DetailPanel(){
    if(!selectedColor) return <View style={{padding:12}}><Text style={{color:'#666'}}>点选色卡查看详细配方与注意事项</Text></View>;
    const c = selectedColor;
    return (
      <ScrollView style={{padding:12}}>
        <View style={{height:120, backgroundColor:c.RGB.hex, borderRadius:8}} />
        <Text style={{fontWeight:'700', marginTop:8}}>{c.name} · {c.id}</Text>
        <Text style={{marginTop:6}}>CMYK: C{c.CMYK.C} M{c.CMYK.M} Y{c.CMYK.Y} K{c.CMYK.K}</Text>
        <Text style={{marginTop:6}}>RGB: {c.RGB.hex}  LAB: L{c.LAB.L} a{c.LAB.a} b{c.LAB.b}</Text>
        <Text style={{marginTop:8, fontWeight:'700'}}>推荐配方（示例）</Text>
        <Text style={{color:'#666', marginTop:6}}>普通油墨：C{Math.round(c.CMYK.C)} M{Math.round(c.CMYK.M)} Y{Math.round(c.CMYK.Y)} K{Math.round(c.CMYK.K)}</Text>
        <Text style={{color:'#666', marginTop:6}}>UV 建议：视材料而定，透明材质需白底</Text>
        <Text style={{marginTop:8, fontWeight:'700'}}>注意事项</Text>
        <Text style={{color:'#666', marginTop:6}}>示例: 透明PET 建议白墨 30%-60%；银龙需打白并注意反光。</Text>
        <View style={{flexDirection:'row', marginTop:12}}>
          <TouchableOpacity onPress={()=>Alert.alert('保存','配方已保存（示例）。')} style={{padding:10, backgroundColor:'#0A84FF', borderRadius:6, marginRight:8}}><Text style={{color:'#fff'}}>保存配方</Text></TouchableOpacity>
          <TouchableOpacity onPress={()=>Alert.alert('导出','PDF/Excel 导出占位')} style={{padding:10, backgroundColor:'#34C759', borderRadius:6}}><Text style={{color:'#fff'}}>导出报告</Text></TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  function Home(){
    return (
      <ScrollView style={{padding:12}}>
        <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:12}}>
          <TouchableOpacity onPress={onPickImage} style={{flex:1, marginRight:8, backgroundColor:'#fff', padding:12, borderRadius:8, borderWidth:1, borderColor:'#eee'}}><Text>📸 拍照提色</Text></TouchableOpacity>
          <TouchableOpacity onPress={onStartVoice} style={{flex:1, marginLeft:8, backgroundColor:'#fff', padding:12, borderRadius:8, borderWidth:1, borderColor:'#eee'}}><Text>🎤 语音助手</Text></TouchableOpacity>
        </View>

        <View style={{backgroundColor:'#fff', borderRadius:8, padding:12, borderWidth:1, borderColor:'#eee'}}>
          <Text style={{fontWeight:'700', marginBottom:8}}>快速颜色查询</Text>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <TouchableOpacity onPress={()=>setTab("色卡")} style={{padding:8}}><Text style={{color:'#007AFF'}}>去色卡</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>setTab("材料")} style={{padding:8}}><Text style={{color:'#007AFF'}}>去材料</Text></TouchableOpacity>
          </View>
        </View>

        <View style={{marginTop:12}}>
          <Text style={{fontWeight:'700'}}>最近使用</Text>
          <View style={{height:120, backgroundColor:'#fff', borderRadius:8, marginTop:8, borderWidth:1, borderColor:'#eee', justifyContent:'center', alignItems:'center'}}>
            <Text style={{color:'#666'}}>暂无记录</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#f3f4f6'}}>
      {/* Top bar */}
      <View style={{padding:12, backgroundColor:'#fff', borderBottomWidth:1, borderColor:'#eee'}}>
        <Text style={{textAlign:'center', fontWeight:'700'}}>标签印刷现场调色助手</Text>
      </View>

      {/* Main area */}
      <View style={{flex:1}}>
        {tab==="调色" && <Home />}
        {tab==="色卡" && (
          <View style={{flex:1}}>
            <ColorGrid />
            <View style={{height:220}}>
              <DetailPanel />
            </View>
          </View>
        )}
        {tab==="材料" && <MaterialPanel />}
        {tab==="记录" && <ScrollView style={{padding:12}}><Text>生产记录 / 调色历史（占位）</Text></ScrollView>}
        {tab==="我的" && <ScrollView style={{padding:12}}><Text>设置 / 账号 / 关于（占位）</Text></ScrollView>}
      </View>

      {/* Bottom Tab (WeChat-like) */}
      <View style={{height:64, flexDirection:'row', borderTopWidth:1, borderColor:'#eee', backgroundColor:'#fff'}}>
        {TABS.map(ti=> (
          <TouchableOpacity key={ti} onPress={()=>{ setTab(ti); setSelectedColor(null); }} style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Text style={{color: tab===ti ? '#007AFF' : '#666', fontSize:12}}>{ti}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}
