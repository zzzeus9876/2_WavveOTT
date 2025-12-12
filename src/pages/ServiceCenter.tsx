import "./scss/ServiceCenter.scss";
const ServiceCenter = () => {
  return (
    <main className="service-center-wrap">
      <div className="inner">
        <section className="card-list">
          <h2>고객센터</h2>
          <div>내용</div>
        </section>
        <div className="">inner 안에서만 보여지면 되는 컨텐츠</div>
      </div>
    </main>
  );
};

export default ServiceCenter;
