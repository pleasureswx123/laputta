const items = [
  { icon: '📍', label: '注册地址', value: '北京市朝阳区' },
  { icon: '📅', label: '成立日期', value: '2023年9月26日' },
  { icon: '💰', label: '注册资本', value: '1000万元人民币' },
  { icon: '🏢', label: '企业性质', value: '民营小微企业' },
  { icon: '📜', label: '经营状态', value: '正常开业' },
  { icon: '🎖️', label: '行政许可', value: '出版物零售 · 增值电信 · 电影发行 · 网络文化' },
]

const DELAYS = ['delay-1', 'delay-2', 'delay-3', 'delay-4', 'delay-1', 'delay-2']

export default function CompanyInfo() {
  return (
    <section className="info-section section" id="info">
      <div className="container">
        <div className="section-label reveal">COMPANY INFO · 公司信息</div>
        <h2 className="section-title reveal delay-1">基本信息</h2>
        <div className="info-grid">
          {items.map((item, i) => (
            <div key={item.label} className={`info-item reveal ${DELAYS[i]}`}>
              <div className="info-icon">{item.icon}</div>
              <div className="info-content">
                <div className="info-label">{item.label}</div>
                <div className="info-value">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
