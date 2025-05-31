import React, { useState } from "react";

const ContactUs = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <section className="">
            <div className="bg-primary2 px-6 sm:px-8 md:px-14 py-10 sm:py-12 md:py-14 text-center">
                <h1 className="font-poppins text-2xl sm:text-3xl md:text-3xl font-medium">
                    ANY QUESTION TO
                    <span className="font-poppins font-bold ml-2">FITSPACE</span>
                </h1>
            </div>
            <div className="min-h-screen flex items-center justify-center bg-putih px-4 sm:px-6 py-10">
                <div className="w-full max-w-5xl h-auto md:h-[30rem] flex flex-col md:flex-row rounded-lg shadow-lg">
                    {/* Left Form Section */}
                    <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center rounded-t-lg md:rounded-l-lg md:rounded-tr-none p-6">
                        <h1 className="text-2xl sm:text-3xl font-bold mb-6 md:mb-10 text-hitam-800">
                            Contact Us
                        </h1>
                        <form onSubmit={handleSubmit} className="w-full space-y-4">
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                className="w-full border border-gray-300 rounded-3xl p-3 focus:outline-primary focus:ring-primary font-poppins"
                            />
                            <input
                                type="text"
                                placeholder="Name"
                                required
                                className="w-full border border-gray-300 rounded-3xl p-3 focus:outline-primary focus:ring-primary font-poppins"
                            />
                            <textarea
                                placeholder="Description"
                                required
                                className="w-full border border-gray-300 rounded-3xl p-3 focus:outline-primary focus:ring-primary font-poppins"
                            ></textarea>
                            <button
                                type="submit"
                                className="w-full border text-putih bg-primary border-gray-300 rounded-3xl p-3 focus:outline-primary focus:ring-primary font-poppins"
                            >
                                Submit
                            </button>
                        </form>
                    </div>

                    {/* Right Text Section */}
                    <div className="w-full md:w-1/2 bg-primary text-white flex flex-col justify-center rounded-b-lg md:rounded-r-lg md:rounded-bl-none p-6 sm:p-8 md:p-10">
                        <h2 className="font-poppins text-2xl sm:text-3xl font-bold mb-4">
                            Contact with Fitspace Team
                        </h2>
                        <p className="font-poppins text-sm mb-4 text-putih font-semibold">
                            Got questions, suggestions, or need assistance? We’re here to help!
                        </p>
                        <p className="font-poppins text-sm leading-6 text-putih">
                            Our team at FitSpace is dedicated to ensuring your experience is smooth
                            and hassle-free. Whether you need help with bookings, have feedback to
                            share, or just want to learn more about our services, don’t hesitate to
                            reach out.
                        </p>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4">
                    <div className="bg-white rounded-lg p-6 sm:p-8 shadow-lg text-center max-w-md w-full">
                        <h2 className="text-xl sm:text-2xl font-bold mb-4">Email Successfully Sent</h2>
                        <p className="mb-6">Thank you for reaching out to us. We will get back to you shortly.</p>
                        <button
                            onClick={closeModal}
                            className="px-6 py-2 bg-primary text-white rounded-3xl font-poppins"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ContactUs;
