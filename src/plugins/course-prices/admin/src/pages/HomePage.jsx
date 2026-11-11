import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Field, Flex, Typography } from '@strapi/design-system';
import { Page, useFetchClient } from '@strapi/strapi/admin';

const toInput = (value) => (value == null ? '' : String(value));

const HomePage = () => {
  const { get, post } = useFetchClient();

  const [directions, setDirections] = useState([]);
  const [directionId, setDirectionId] = useState('');
  const [courses, setCourses] = useState([]);
  const [bulkOld, setBulkOld] = useState('');
  const [bulkNew, setBulkNew] = useState('');
  const [loadingDirections, setLoadingDirections] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoadingDirections(true);
        const { data } = await get('/course-prices/directions');
        if (cancelled) return;
        const list = data?.data || [];
        setDirections(list);
        if (list[0]?.documentId) setDirectionId(list[0].documentId);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.error?.message || 'Не удалось загрузить направления');
      } finally {
        if (!cancelled) setLoadingDirections(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [get]);

  const loadCourses = useCallback(async (id) => {
    if (!id) {
      setCourses([]);
      return;
    }

    setLoadingCourses(true);
    setError('');

    try {
      const { data } = await get(`/course-prices/courses?directionDocumentId=${encodeURIComponent(id)}`);
      setCourses(
        (data?.data || []).map((item) => ({
          documentId: item.documentId,
          title: item.title,
          default_price: toInput(item.default_price),
          old_price_rub: toInput(item.old_price_rub),
          initialDefault: toInput(item.default_price),
          initialOld: toInput(item.old_price_rub),
        })),
      );
    } catch (err) {
      setCourses([]);
      setError(err?.response?.data?.error?.message || 'Не удалось загрузить курсы');
    } finally {
      setLoadingCourses(false);
    }
  }, [get]);

  useEffect(() => {
    loadCourses(directionId);
  }, [directionId, loadCourses]);

  const changed = useMemo(
    () => courses.filter((item) => item.default_price !== item.initialDefault || item.old_price_rub !== item.initialOld),
    [courses],
  );

  const onPriceChange = (documentId, field, value) => {
    setCourses((list) => list.map((item) => (
      item.documentId === documentId ? { ...item, [field]: value } : item
    )));
  };

  const onSave = async () => {
    if (!changed.length || saving) return;

    setSaving(true);
    setError('');
    setNotice('');

    try {
      const { data } = await post('/course-prices/save', {
        updates: changed.map((item) => ({
          documentId: item.documentId,
          default_price: item.default_price,
          old_price_rub: item.old_price_rub,
        })),
      });
      setNotice(`Сохранено курсов: ${data?.data?.updated ?? changed.length}`);
      await loadCourses(directionId);
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Не удалось сохранить цены');
    } finally {
      setSaving(false);
    }
  };

  const onApply = async () => {
    if (!directionId || applying) return;

    setApplying(true);
    setError('');
    setNotice('');

    try {
      const { data } = await post('/course-prices/apply', {
        directionDocumentId: directionId,
        default_price: bulkNew,
        old_price_rub: bulkOld,
      });
      setNotice(`Цена обновлена у курсов: ${data?.data?.updated ?? 0}`);
      await loadCourses(directionId);
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Не удалось обновить цены направления');
    } finally {
      setApplying(false);
    }
  };

  return (
    <Page.Main>
      <Page.Title>Цены курсов</Page.Title>
      <Box padding={8}>
        <Flex direction="column" alignItems="stretch" gap={6}>
          <Flex justifyContent="space-between" alignItems="center">
            <Typography variant="alpha">Цены курсов</Typography>
            <Button onClick={onSave} disabled={!changed.length || saving || loadingCourses} loading={saving}>
              Сохранить
            </Button>
          </Flex>

          {error ? (
            <Alert closeLabel="Закрыть" variant="danger" onClose={() => setError('')}>
              {error}
            </Alert>
          ) : null}
          {notice ? (
            <Alert closeLabel="Закрыть" variant="success" onClose={() => setNotice('')}>
              {notice}
            </Alert>
          ) : null}

          <Flex gap={2} wrap="wrap">
            {loadingDirections ? <Typography>Загрузка направлений…</Typography> : null}
            {directions.map((item) => (
              <Button
                key={item.documentId}
                variant={item.documentId === directionId ? 'default' : 'tertiary'}
                onClick={() => setDirectionId(item.documentId)}
              >
                {item.title}
              </Button>
            ))}
          </Flex>

          <Flex gap={4} alignItems="flex-end" wrap="wrap">
            <Field.Root name="bulk-old">
              <Field.Label>Старая цена для всех</Field.Label>
              <Field.Input
                type="number"
                min={0}
                step={1}
                value={bulkOld}
                onChange={(event) => setBulkOld(event.target.value)}
              />
            </Field.Root>
            <Field.Root name="bulk-new">
              <Field.Label>Новая цена для всех</Field.Label>
              <Field.Input
                type="number"
                min={0}
                step={1}
                value={bulkNew}
                onChange={(event) => setBulkNew(event.target.value)}
              />
            </Field.Root>
            <Button
              variant="secondary"
              onClick={onApply}
              disabled={!directionId || applying || loadingCourses}
              loading={applying}
            >
              Обновить
            </Button>
          </Flex>

          {loadingCourses ? <Typography>Загрузка курсов…</Typography> : null}
          {!loadingCourses && directionId && !courses.length ? (
            <Typography textColor="neutral600">В этом направлении нет опубликованных курсов</Typography>
          ) : null}

          <Flex direction="column" alignItems="stretch" gap={3}>
            {courses.map((course) => (
              <Flex key={course.documentId} gap={4} alignItems="flex-end" wrap="wrap">
                <Box style={{ flex: '1 1 240px' }}>
                  <Typography>{course.title}</Typography>
                </Box>
                <Field.Root name={`${course.documentId}-old`}>
                  <Field.Label>Старая цена</Field.Label>
                  <Field.Input
                    type="number"
                    min={0}
                    step={1}
                    value={course.old_price_rub}
                    onChange={(event) => onPriceChange(course.documentId, 'old_price_rub', event.target.value)}
                  />
                </Field.Root>
                <Field.Root name={`${course.documentId}-new`}>
                  <Field.Label>Новая цена</Field.Label>
                  <Field.Input
                    type="number"
                    min={0}
                    step={1}
                    value={course.default_price}
                    onChange={(event) => onPriceChange(course.documentId, 'default_price', event.target.value)}
                  />
                </Field.Root>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Box>
    </Page.Main>
  );
};

export default HomePage;
