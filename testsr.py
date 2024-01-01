import RPi.GPIO as GPIO
import time
import websocket

# 定義GPIO pin
TRIG_PIN = 23
ECHO_PIN = 24

# 設定WebSocket伺服器的地址
ws_server_address = "ws://127.0.0.1:8765"

# 設定WebSocket連線
ws = websocket.create_connection(ws_server_address)
pulse_start_time = 0
pulse_end_time = 0
flag = 0


def setup():
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(TRIG_PIN, GPIO.OUT)
    GPIO.setup(ECHO_PIN, GPIO.IN)


def get_distance():
    global pulse_start_time, pulse_end_time  # Add these lines
    GPIO.output(TRIG_PIN, GPIO.HIGH)
    time.sleep(0.00001)
    GPIO.output(TRIG_PIN, GPIO.LOW)

    while GPIO.input(ECHO_PIN) == 0:
        pulse_start_time = time.time()

    while GPIO.input(ECHO_PIN) == 1:
        pulse_end_time = time.time()

    pulse_duration = pulse_end_time - pulse_start_time
    distance = pulse_duration * 17150
    distance = round(distance, 2)

    return distance


def main():
    try:
        setup()

        while True:
            distance = get_distance()
            #print(distance)
            if distance < 6:
                # 如果距離小於6cm，發送資料到WebSocket伺服器
                if flag == 0:
                    ws.send("{\"get\":\"get\",\"flag\":true}")
                    flag = 1
            else:
                flag = 0
            time.sleep(1)

    except KeyboardInterrupt:
        pass

    finally:
        GPIO.cleanup()
        ws.close()


if __name__ == "__main__":
    main()
