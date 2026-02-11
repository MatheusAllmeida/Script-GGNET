# 📡 Script-GGNET

Repositório central de **scripts Tampermonkey e automações em JavaScript** voltados para **auxílio operacional, análise técnica e suporte em ambientes de VOZ / SIP / Telecom**, utilizados em rotinas de NOC e suporte técnico.

Este repositório reúne diversos scripts independentes, cada um focado em facilitar tarefas específicas do dia a dia operacional.

---

## 🎯 Objetivo

- Automatizar coleta de informações técnicas
- Reduzir erros manuais em análises
- Agilizar troubleshooting de chamadas
- Padronizar informações para suporte e NOC

---

## 📦 Scripts disponíveis

### 🔹 Call Trace Helper
Script Tampermonkey para extração automática de dados de chamadas SIP na página Call Trace.

**Funções:**
- Origem e destino da chamada
- IP local e remoto
- Código de resposta SIP
- Data e hora no formato brasileiro

### 🔹 Huawei Clear Offline

Script Tampermonkey para remover automaticamente dispositivos off-line em roteadores Huawei.

**Funções:**
- Limpa todos os dispositivos desconectados
- Funciona em interface dinâmica/iframe
- Ativado ao pressionar DELETE
- Para automaticamente ao finalizar a limpeza

**Uso:**
- Abra a página Dispositivos off-line e pressione DELETE.

###🔹 Huawei WAN PPPoE – VOIP Auto Config

Script Tampermonkey para configuração automática de WAN PPPoE VOIP na aba WAN Configuration de ONTs Huawei.

**Funções:**
- Seleciona automaticamente PPPoE
- Define serviço como VOIP
- Captura VLAN automaticamente da tabela WAN
- Configura MTU (1492)
- Preenche usuário e senha PPPoE
- Modal flutuante, móvel e com fundo transparente

### 🔹 Huawei VoIP Basic – SIP Auto Config

Script Tampermonkey para configuração rápida de SIP e usuário na aba VoIP Basic de ONTs Huawei.

**Funções:**
- Define servidor SIP automaticamente
- Configura portas SIP (5060)
- Ajusta período de registro
- Preenche número, autenticação e senha SIP
- Define região como Brasil
- Vincula automaticamente WAN e RTP ao VOIP
- Modal flutuante, móvel e com fundo transparente

### 🔹 MAC VENDORS
Script Tampermonkeu para capturar MAC de aparelhos e substituir pelo nome do aparelho

👉 **Instalação:**  

- [📥 Instalar Call Trace Helper](https://raw.githubusercontent.com/MatheusAllmeida/Script-GGNET/main/SBC/call-trace-helper.user.js)
- [📥 Instalar Huawei Clear Offline](https://raw.githubusercontent.com/MatheusAllmeida/Script-GGNET/main/Huawei/clear-huawei.user.js)
- [📥 Instalar Huawei VOIP WAN PPPoE Configuration](https://raw.githubusercontent.com/MatheusAllmeida/Script-GGNET/main/Huawei/WANPPPoE%E2%80%93VOIP-Configuration.user.js)
- [📥 Instalar Huawei VOIP BASIC Configuration](https://raw.githubusercontent.com/MatheusAllmeida/Script-GGNET/main/Huawei/VoIPBasic-Configuration.user.js)
- [📥 Instalar MAC Vendors](https://github.com/MatheusAllmeida/Script-GGNET/raw/refs/heads/main/Mac/MACVendorResolver.user.js)
- [📥 instalar ProtocoloSIP](https://github.com/MatheusAllmeida/Script-GGNET/raw/refs/heads/main/ProtocoloSIP/protocoloSIP.user.js)
- 
---

> ℹ️ Novos scripts serão adicionados conforme a necessidade operacional.

---

## 🚀 Instalação (padrão)

1. Instale a extensão **Tampermonkey** no navegador
2. Clique no link de instalação do script desejado
3. Confirme a instalação

---

## 🔄 Atualizações
Os scripts são atualizados automaticamente pelo Tampermonkey sempre que uma nova versão for publicada neste repositório.

---

## ⚠️ Aviso
Este repositório é destinado a **uso técnico interno**. Utilize os scripts apenas em sistemas e ambientes onde você possui autorização.

---

## 👨‍💻 Autor
**Matheus de Almeida**  
Scripts desenvolvidos para apoio técnico em ambientes de telecomunicações, VOIP e SIP.
