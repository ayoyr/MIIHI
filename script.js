<!-- HTMLファイルのheadまたはbodyの閉じタグの直前に以下を追加 -->
<script type="module">
  import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

  const apiKeyInput = document.getElementById('api-key-input');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');
  const chatHistory = document.getElementById('chat-history');

  let genAI; // GoogleGenerativeAIのインスタンスを格納する変数
  let model; // モデルインスタンスを格納する変数

  // メッセージをチャット履歴に追加する関数
  function addMessage(sender, text) {
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'ai-message');

      const bubbleDiv = document.createElement('div');
      bubbleDiv.classList.add('message-bubble');
      bubbleDiv.textContent = text;

      messageDiv.appendChild(bubbleDiv);
      chatHistory.appendChild(messageDiv);
      chatHistory.scrollTop = chatHistory.scrollHeight; // スクロールを一番下へ
  }

  // APIキー設定と初期化
  apiKeyInput.addEventListener('change', () => {
      const apiKey = apiKeyInput.value.trim();
      if (apiKey) {
          try {
              genAI = new GoogleGenerativeAI(apiKey);
              model = genAI.getGenerativeModel({ model: "gemini-pro"}); // 使用するモデルを指定
              apiKeyInput.disabled = true; // APIキーが設定されたら入力欄を無効化
              addMessage('ai', 'APIキーが設定されました。チャットを開始できます！');
          } catch (error) {
              addMessage('ai', 'APIキーの初期化に失敗しました。キーが正しいか確認してください。');
              console.error("API Key initialization error:", error);
          }
      }
  });

  // メッセージ送信処理
  sendButton.addEventListener('click', async () => {
      const userMessage = userInput.value.trim();
      if (userMessage === '') return;

      if (!model) {
          addMessage('ai', 'Gemini APIキーを設定してください。');
          return;
      }

      addMessage('user', userMessage);
      userInput.value = ''; // 入力欄をクリア

      try {
          // AIの応答待ち中に「考え中」のようなメッセージを表示しても良いでしょう
          // addMessage('ai', 'AIが応答を作成中...');

          const result = await model.generateContent(userMessage);
          const response = await result.response;
          const text = response.text();
          addMessage('ai', text);
      } catch (error) {
          addMessage('ai', 'AIからの応答の取得中にエラーが発生しました。');
          console.error("Gemini API error:", error);
      }
  });

  // Enterキーでメッセージ送信
  userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
          sendButton.click();
      }
  });

  addMessage('ai', 'Gemini APIキーを入力してEnterを押してください。');
</script>
