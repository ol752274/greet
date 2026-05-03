import { useEffect } from 'react';
import { api } from '../../services/api';
import useTemplateStore from '../../store/useTemplateStore';
import useAuthStore from '../../store/useAuthStore';
import TemplateCard from './TemplateCard';
import s from './TemplateGrid.module.css';

export default function TemplateGrid({ selectedId, onSelect, onSelectLocked }) {
  const { templates, activeCategory, loading, setTemplates, setLoading } = useTemplateStore();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    setLoading(true);
    api.getTemplates(activeCategory)
      .then(setTemplates)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory]);

  if (loading) return <div className={s.loading}>Loading templates…</div>;

  return (
    <div className={s.grid}>
      {templates.map((t) => (
        <TemplateCard
          key={t.id}
          template={t}
          isSelected={selectedId === t.id}
          onClick={() => t.locked ? onSelectLocked() : onSelect(t)}
          userName={user?.name || ''}
          userAvatar={user?.avatarUrl || null}
        />
      ))}
    </div>
  );
}
