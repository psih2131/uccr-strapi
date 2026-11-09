import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  SingleSelect,
  SingleSelectOption,
  Typography,
  Alert,
} from '@strapi/design-system';
import { Page, useFetchClient } from '@strapi/strapi/admin';

const HomePage = () => {
  const { get, post } = useFetchClient();

  const [directions, setDirections] = useState([]);
  const [directionId, setDirectionId] = useState('');
  const [fileName, setFileName] = useState('');
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDirections, setLoadingDirections] = useState(true);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoadingDirections(true);
        const { data } = await get('/course-import/directions');
        if (!cancelled) {
          setDirections(data?.data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || 'Не удалось загрузить направления');
        }
      } finally {
        if (!cancelled) setLoadingDirections(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [get]);

  const canImport = useMemo(
    () => Boolean(directionId && posts && !loading),
    [directionId, posts, loading],
  );

  const onFileChange = async (event) => {
    const file = event.target.files?.[0];
    setResult(null);
    setError('');
    setPosts(null);
    setFileName('');

    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      setPosts(parsed);
      setFileName(file.name);
    } catch (err) {
      setError('Некорректный JSON-файл');
    }
  };

  const onImport = async () => {
    if (!canImport) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const { data } = await post('/course-import/run', {
        directionDocumentId: directionId,
        posts,
      });
      setResult(data?.data || null);
    } catch (err) {
      setError(err?.response?.data?.error?.message || err?.message || 'Ошибка импорта');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page.Main>
      <Page.Title>Импорт курсов</Page.Title>
      <Box padding={8}>
        <Flex direction="column" alignItems="stretch" gap={5}>
          <Typography variant="alpha">Импорт курсов</Typography>
          <Typography textColor="neutral600">
            Выберите направление, загрузите JSON из парсера. Курсы без ai_data будут пропущены.
            Существующие курсы обновляются по slug. Если в курсе есть category.value.id_cat,
            он связывается с категорией по cat_id. Без категории курс всё равно импортируется.
          </Typography>

          {error ? (
            <Alert closeLabel="Закрыть" variant="danger" onClose={() => setError('')}>
              {error}
            </Alert>
          ) : null}

          {result ? (
            <Alert closeLabel="Закрыть" variant="success" onClose={() => setResult(null)}>
              Всего: {result.total}. Создано: {result.created}. Обновлено: {result.updated}.
              Пропущено: {result.skipped}. Ошибок: {result.errors?.length || 0}.
            </Alert>
          ) : null}

          {result?.errors?.length ? (
            <Box
              background="neutral100"
              padding={4}
              hasRadius
              style={{ maxHeight: 220, overflow: 'auto' }}
            >
              {result.errors.map((item, index) => (
                <Typography key={`${item.slug || item.id}-${index}`} tag="p">
                  {item.slug || item.id || '—'}: {item.message}
                </Typography>
              ))}
            </Box>
          ) : null}

          <SingleSelect
            label="Направление"
            placeholder={loadingDirections ? 'Загрузка…' : 'Выберите направление'}
            value={directionId}
            onChange={setDirectionId}
            disabled={loadingDirections || loading}
          >
            {directions.map((item) => (
              <SingleSelectOption key={item.documentId} value={item.documentId}>
                {item.title}
              </SingleSelectOption>
            ))}
          </SingleSelect>

          <Flex direction="column" alignItems="flex-start" gap={2}>
            <Typography fontWeight="bold">JSON-файл</Typography>
            <input type="file" accept="application/json,.json" onChange={onFileChange} disabled={loading} />
            {fileName ? <Typography textColor="neutral600">Файл: {fileName}</Typography> : null}
          </Flex>

          <Flex>
            <Button onClick={onImport} loading={loading} disabled={!canImport}>
              Импортировать
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Page.Main>
  );
};

export default HomePage;
