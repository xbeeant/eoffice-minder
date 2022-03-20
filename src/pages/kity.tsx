import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Alert, Button, Dropdown, Form, Menu, Space, Spin } from 'antd';
import Xmindparser from 'xmindparser';
import { DownOutlined } from '@ant-design/icons';

const Meditor = forwardRef((props, ref) => {
  const [form] = Form.useForm();
  const [minder, setMinder] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const {
    meditorPath = './kity/index.html',
    style = { width: '100%', height: '100%', minWidth: '100%' },
    onChange = undefined,
    readonly = false,
    imageUpload = undefined,
    initValue = undefined,
    headers = undefined,
    filename,
    onSave,
  } = props;

  const minderRef = useRef();

  useImperativeHandle(
    ref,
    () => {
      return {
        minder,
        importData: (a, b, c) => minder?.importData?.(a, b, c),
        importJson: (a) => minder?.importJson?.(a),
        exportData: (a, b) => minder?.exportData?.(a, b),
        exportJson: () => minder?.exportJson?.(),
      };
    },
    [minder],
  );

  const onLoad = () => {
    const refMinder = minderRef.current?.contentWindow?.minder;
    if (refMinder) {
      setMinder(refMinder);
      if (initValue) refMinder?.importJson?.(initValue);
      if (readonly) refMinder?.fire('readonly');
      if (onChange) refMinder?.on('contentchange', onChange);
    }
    setLoading(false);
    console.log('onloaded end');
  };

  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      console.log(e);
      const currKey = e.keyCode || e.which || e.charCode;
      if (currKey == 83 && (e.ctrlKey || e.metaKey)) {
        onSave(minder?.exportJson());
        return false;
      }
    });
  }, []);

  window.minderLoaded = (kityminder) => {
    console.log(kityminder.data.getRegisterProtocol());
    onLoad();
  };

  const exportDownload = (content, name) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const objectURL = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = objectURL;
    anchor.download = name;
    anchor.click();
    URL.revokeObjectURL(objectURL);
  };

  const xmindExport = (json) => {
    // 脑图 json转xmind 浏览器返回blob node返回pathurl
    const parser = new Xmindparser();
    parser.JSONToXmind(json).then((content) => {
      exportDownload(content, `${filename || '文件'}.xmind`);
    });
  };

  const pngExport = (base64, name) => {
    const base64ToBlob = (code) => {
      const parts = code.split(';base64,');
      const contentType = parts[0].split(':')[1];
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      return new Blob([uInt8Array], {
        type: contentType,
      });
    };
    const blob = base64ToBlob(base64);
    const objectURL = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = objectURL;
    anchor.download = name;
    anchor.click();
    URL.revokeObjectURL(objectURL);
  };

  const onExport = ({ key }) => {
    switch (key) {
      case 'xmind':
        xmindExport(minder.exportJson());
        break;
      case 'png':
        minder.exportData(key).then((content) => {
          pngExport(content, `${filename || '新文件'}.${key}`);
        });
        break;
      case 'markdown':
        minder.exportData(key).then((content) => {
          exportDownload(content, `${filename || '新文件'}.md`);
        });
        break;
      default:
        minder.exportData(key).then((content) => {
          exportDownload(content, `${filename || '新文件'}.${key}`);
        });
    }
  };

  const exportMenu = (
    <Menu onClick={onExport}>
      <Menu.Item key="xmind">Xmind</Menu.Item>
      <Menu.Item key="png">PNG 图片</Menu.Item>
      <Menu.Item key="markdown">Markdown</Menu.Item>
      <Menu.Item key="svg">SVG 矢量图</Menu.Item>
      <Menu.Item key="text">文本文件</Menu.Item>
    </Menu>
  );

  const saveMenu = (
    <Menu
      onClick={({ key }) => {
        // 直接保存
        if (minderRef.current) {
          onSave(minder.exportJson());
        }
      }}
    >
      <Menu.Item key="saveOnly">仅保存</Menu.Item>
    </Menu>
  );

  return (
    <>
      {loading && (
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <Spin>
            <Alert message="初始化中..." type="info" />
          </Spin>
        </div>
      )}
      {!loading && (
        <div style={{ position: 'absolute', top: 0, right: 20 }}>
          <Space>
            <Button
              type="primary"
              onClick={(e) => {
                e.preventDefault();
                const url = window.location;
                window.location.href = url.href.replace('mode=view', 'mode=edit');
              }}
            >
              编辑
            </Button>
            <Dropdown overlay={exportMenu} key="export">
              <Button onClick={(e) => e.preventDefault()}>
                导出 <DownOutlined />
              </Button>
            </Dropdown>
            <Dropdown overlay={saveMenu}>
              <Button type="primary" onClick={(e) => e.preventDefault()}>
                保存
              </Button>
            </Dropdown>
          </Space>
        </div>
      )}
      <iframe
        title="Meditor"
        id="meditorFrame"
        src={meditorPath}
        style={loading ? { width: 0, height: 0 } : { border: 0, ...style }}
        ref={minderRef}
        data-upload={imageUpload}
        data-headers={headers}
      />
    </>
  );
});

export default Meditor;
