#include <ArduinoJson.h>
bool w_ls, a_ls, s_ls, d_ls, up_ls, down_ls;
bool w_flag, a_flag, s_flag, d_flag, g_flag, g_flag2;
void setup() {
  Serial.begin(115200);
  w_ls = a_ls = s_ls = d_ls = up_ls = down_ls = false;
  w_flag = a_flag = s_flag = d_flag = g_flag = g_flag2 = false;
  for (int i = 2; i <= 11; i++) {
    pinMode(i, OUTPUT);
    digitalWrite(i, LOW);
  }
  pinMode(12, INPUT_PULLUP);
  pinMode(13, INPUT_PULLUP);
  for (uint8_t i = 34; i <= 52; i = i + 2) {
    pinMode(i, INPUT_PULLUP);
  }
  close();
  delay(1000);
  ad_stop();
  ws_stop();
  ud_stop();
  open();
  setled(100);
  //end();
}

void loop() {
  updatels();
  if (!g_flag) {
    if (w_flag && !w_ls) {
      w();
    } else if (s_flag && !s_ls) {
      s();
    } else {
      ws_stop();
    }
    if (a_flag && !a_ls) {
      a();
    } else if (d_flag && !d_ls) {
      d();
    } else {
      ad_stop();
    }
  }
  if (down_ls) {
    g_flag = false;
    ud_stop();
    close();
    delay(100);
    end();
  }
  if (g_flag) {
    ws_stop();
    ad_stop();
    if (g_flag2) {
      g_flag = false;
      g_flag2 = false;
      ud_stop();
      close();
      ws_stop();
      ad_stop();
      delay(100);
      end();
    } else {
      down();
    }
  } else {
    ud_stop();
  }

  if (Serial.available()) {
    // 等待接收完整的JSON字串s
    String jsonStr = Serial.readStringUntil('\n');

    // 解析JSON
    DynamicJsonDocument doc(256);  // 設定JSON文件的大小
    DeserializationError error = deserializeJson(doc, jsonStr);

    // 檢查是否發生錯誤
    if (error) {
      Serial.print("JSON parsing failed: ");
      Serial.println(error.c_str());
    } else {
      // 取得JSON物件中的 "get" 值
      const char* action = doc["get"];
      bool flag = doc["flag"];
      // 根據不同的值執行相應的函數
      if (strcmp(action, "up") == 0) {  //前
        w_flag = flag;
      } else if (strcmp(action, "down") == 0) {  //後
        s_flag = flag;
      } else if (strcmp(action, "left") == 0) {  //左
        a_flag = flag;
      } else if (strcmp(action, "right") == 0) {  //右
        d_flag = flag;
      } else if (strcmp(action, "grab") == 0) {  //夾
        if (g_flag) {
          g_flag2 = true;
        } else {
          g_flag = true;
          g_flag2 = false;
        }

      } else {
      }
    }
  }
}
void end() {
  while (digitalRead(12) != 1) {
    up();
  }
  ud_stop();
  down();
  delay(100);
  ud_stop();
  delay(100);
  while (analogRead(A0) < 570 || analogRead(A2) < 600) {
    if (analogRead(A0) < 570) {
      a();
    } else {
      ad_stop();
    }
    if (analogRead(A2) < 600) {
      s();
    } else {
      ws_stop();
    }
  }
  ad_stop();
  ws_stop();
  delay(500);
  open();
}
void updatels() {
  a_ls = analogRead(A0) >= 570;
  d_ls = analogRead(A1) <= 490;
  s_ls = analogRead(A2) >= 600;
  w_ls = analogRead(A3) >= 860;  //870;
  up_ls = digitalRead(12);
  down_ls = digitalRead(13);
}
void stop_all() {
  ws_stop();
  ad_stop();
  ud_stop();
}

void setled(int dim) {
  analogWrite(3, dim);
}
void ws_stop() {
  digitalWrite(8, LOW);
  digitalWrite(9, LOW);
}
void w() {  //前
  digitalWrite(9, LOW);
  digitalWrite(8, HIGH);
}
void s() {  //後
  digitalWrite(9, HIGH);
  digitalWrite(8, LOW);
}
void ad_stop() {
  digitalWrite(10, LOW);
  digitalWrite(11, LOW);
}
void a() {  //左
  digitalWrite(11, LOW);
  digitalWrite(10, HIGH);
}
void d() {  //右
  digitalWrite(11, HIGH);
  digitalWrite(10, LOW);
}
void ud_stop() {
  digitalWrite(6, LOW);
  digitalWrite(7, LOW);
}
void up() {
  digitalWrite(6, LOW);
  digitalWrite(7, HIGH);
}
void down() {
  digitalWrite(6, HIGH);
  digitalWrite(7, LOW);
}
void close() {
  while (analogRead(A4) <= 650) {
    digitalWrite(4, HIGH);
    digitalWrite(5, LOW);
  }
  digitalWrite(4, LOW);
}
void open() {
  while (analogRead(A4) >= 400) {
    digitalWrite(4, LOW);
    digitalWrite(5, HIGH);
  }
  digitalWrite(5, LOW);
}