import asyncio
import websockets
from serial import Serial
from serial_asyncio import create_serial_connection

port_path = 'COM18'
baud_rate = 115200

async def on_data_received(data, send_function):
    print(data.decode())
    await send_function(data.decode())

async def serial_data_handler(serial_reader, send_function):
    while True:
        data = await serial_reader.readuntil(b'\r\n')
        await on_data_received(data, send_function)

async def send(data, clients):
    send_data = data.encode()
    for client in clients:
        await client.send(send_data)

async def ws_handler(websocket, path, clients, send_function):
    print('Client connected')
    try:
        async for message in websocket:
            await send_function(message, clients)
    finally:
        print('Client disconnected')

async def main():
    serial_port = await create_serial_connection(asyncio.Queue, Serial, port=port_path, baudrate=baud_rate)
    serial_reader = asyncio.StreamReader()
    protocol = asyncio.StreamReaderProtocol(serial_reader)
    await serial_port.setup(protocol)

    clients = set()

    start_server = websockets.serve(
        lambda ws, path: ws_handler(ws, path, clients, lambda data, _: send(data, clients)),
        'localhost',
        3000
    )

    async with start_server:
        await asyncio.gather(
            serial_data_handler(serial_reader, lambda data: send(data, clients)),
            start_server.serve_forever()
        )

if __name__ == "__main__":
    asyncio.run(main())
