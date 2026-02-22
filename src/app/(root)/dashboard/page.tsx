"use client";

import React from "react";
import { MessageSquare, Mic, FileText, Sparkles } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="h-full flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="w-14 h-14 sm:w-20 sm:h-20 bg-(--color-green)/10 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <MessageSquare className="w-7 h-7 sm:w-10 sm:h-10 text-(--color-green)" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-4xl font-light tracking-tight mb-3 sm:mb-4">
          Select a meeting to{" "}
          <span className="font-normal text-(--color-green)">
            start chatting
          </span>
        </h1>

        <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-12 max-w-xl mx-auto">
          Choose a meeting from the sidebar or start a new recording to begin
          asking questions and getting AI-powered insights.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <h3 className="font-medium text-xs sm:text-sm mb-1">Record</h3>
            <p className="text-[10px] sm:text-xs text-gray-500">
              Capture your meetings with one click
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <h3 className="font-medium text-xs sm:text-sm mb-1">Transcribe</h3>
            <p className="text-[10px] sm:text-xs text-gray-500">
              AI-powered accurate transcription
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <h3 className="font-medium text-xs sm:text-sm mb-1">Ask</h3>
            <p className="text-[10px] sm:text-xs text-gray-500">
              Get instant answers from your meetings
            </p>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 sm:p-6 text-left">
          <h3 className="font-medium text-xs sm:text-sm mb-2 sm:mb-3 flex items-center gap-2">
            <span className="text-blue-600">💡</span>
            Quick Tips
          </h3>
          <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                Click <strong>&quot;New Meeting&quot;</strong> to start
                recording
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Select any past meeting to ask questions about it</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Use voice or text to interact with the AI</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
