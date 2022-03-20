import { useEffect, useRef, useState } from 'react';
import { request } from 'umi';
import { message, Result, Skeleton } from 'antd';
import { ApiResponse, ResourceInfo, LocationProps } from '@/types';
import KityEditor from './kity';

const Index: ({ location }: { location: LocationProps }) => JSX.Element = ({ location }) => {
  const {
    query: { rid, share, vid, mode, shareId },
  } = location;

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ResourceInfo>();
  const [content, setContent] = useState<string>('');
  const [viewMode, setViewMode] = useState<'view' | 'edit'>(mode);
  const [error, setError] = useState<string>();
  const minderRef = useRef();

  const loadData = async () => {
    setLoading(true);
    if (rid || share) {
      const response = await request<ApiResponse<ResourceInfo>>('/eoffice/api/resource/detail', {
        params: {
          rid,
          vid,
          share,
          shareId,
        },
        skipErrorHandler: true,
      });

      if (response.success) {
        if (mode === 'edit' && !response.data.perm.edit) {
          setViewMode('view');
        }
        // load content from url
        const downloaded = await request(response.data.url);
        setContent(downloaded);
        setData(response.data);
      } else {
        setError(response.msg);
      }
    }
  };

  useEffect(() => {
    loadData().then(() => setLoading(false));
  }, [rid]);

  const renderResult = () => {
    if (error) {
      return <Result status="error" title={error} />;
    }

    return (
      <div
        style={{
          height: '100vh',
        }}
      >
        {!loading && (
          <KityEditor
            filename={data?.name}
            initValue={content}
            meditorPath="./minder/index.html"
            ref={minderRef}
            readonly={mode === 'view' || vid}
            rid={rid}
            imageUpload={'/eoffice/api/resource/detail'}
            mode={viewMode}
            onSave={(value) => {
              request('/eoffice/api/resource', {
                method: 'POST',
                requestType: 'form',
                data: {
                  rid,
                  value: JSON.stringify(value),
                },
              }).then((response) => {
                if (response.success) {
                  message.success(response.msg);
                } else {
                  message.error(response.msg);
                }
              });
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div>
      {loading && <Skeleton />}
      {!loading && renderResult()}
    </div>
  );
};

export default Index;
