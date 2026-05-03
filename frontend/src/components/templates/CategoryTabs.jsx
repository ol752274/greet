import { CATEGORIES } from '../../utils/constants';
import useTemplateStore from '../../store/useTemplateStore';
import s from './CategoryTabs.module.css';

export default function CategoryTabs() {
  const { activeCategory, setCategory } = useTemplateStore();
  return (
    <div className={s.tabs}>
      {CATEGORIES.map((c) => (
        <button key={c.id} className={`${s.tab} ${activeCategory === c.id ? s.active : ''}`} onClick={() => setCategory(c.id)}>
          {c.label}
        </button>
      ))}
    </div>
  );
}
